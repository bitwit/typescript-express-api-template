import * as ts from "typescript"
import * as fs from "fs"
import * as _ from "lodash"

class Constants {
    static readonly NotFound = -1
    static readonly ControllerRegex = /@(Controller|JsonController)\((('|")?.*(?:'|")?)\)/
    static readonly PathRegex = /@(Get|Post|Put|Delete)\((('|").*(?:'|"))\)/
    static readonly BodyRegex = /@Body\(.*\)\s\w+:\s(\w+)/
}

interface Property {
    name: string
    type: string
    decorators: string[]
    parameters: string[],
    returnType: string
}

interface Object {
    name: string
    properties: Property[]
    decorators: string[]
}

interface Path {
    endpoint: string
    method: string
    requestBody: string
    successBody: string
}

interface ObjectDictionary {
    [name: string]: Object
}

namespace Swagger {

    export interface Path {
        [method: string]: Method
    }

    export interface Method {
        parameters: Parameter[],
        responses: any,
        tags?: string[]
    }

    export interface Parameter {
        in: string
        name: string
        required?: boolean
        schema?: {
            $ref: string
        }
    }

    export interface Definition {
        type: "object",
        description?: string,
        properties: {
            [name: string]: {
                type: string
            }
        }
    }

    export interface Document {
        swagger: "2.0"
        info: {
            title: string
            version: string
            description: string
        }
        host: string
        paths: {
            [endpoint: string]: Path
        }
        definitions: {
            [name: string]: Definition
        }
    }
}

/** Serialize a signature (call or construct) */
function getReturnType(checker: ts.TypeChecker, symbol: ts.Symbol) {
    let constructorType = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
    return constructorType.getCallSignatures().map(signature => {
        return checker.typeToString(signature.getReturnType())
    })[0]
}


/** Generate documentation for all classes in a set of .ts files */
function buildRawTypes(fileNames: string[], options: ts.CompilerOptions): ObjectDictionary {

    console.log("filenames", fileNames)
    // Build a program using the set of root file names in fileNames
    let program = ts.createProgram(fileNames, options)

    // Get the checker, we will use it to find more about classes
    let checker = program.getTypeChecker()

    let objectDictionary: ObjectDictionary = {};

    // Visit every sourceFile in the program
    for (const sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            // Walk the tree to search for classes
            ts.forEachChild(sourceFile, visit)
        }
    }

    return objectDictionary;

    /** visit nodes finding exported classes */
    function visit(node: ts.Node) {

        if (!isNodeExported(node)) {
            return
        }

        if (ts.isClassDeclaration(node) && node.name) {

            const symbol = checker.getSymbolAtLocation(node.name);
            const members = node.members || ts.createNodeArray()
            const decorators = node.decorators || ts.createNodeArray()

            const docBody: Object = {
                name: symbol.name,
                properties: [],
                decorators: []
            }

            members.forEach(m => {
                const mSymbol = checker.getSymbolAtLocation(m.name)
                const decors = m.decorators || ts.createNodeArray()
                const syntaxListChildren = m
                    .getChildren()
                    .filter(c => c.kind === ts.SyntaxKind.SyntaxList)
                let parameters: string[] = []
                if (syntaxListChildren.length > 0) {
                    parameters = syntaxListChildren[syntaxListChildren.length - 1]
                        .getChildren()
                        .filter(c => c.getText() != ",")
                        .map(c => c.getText())
                }

                docBody.properties.push({
                    name: mSymbol.name,
                    decorators: decors.map(d => d.getText()),
                    type: m.getLastToken().getFullText(),
                    parameters: parameters,
                    returnType: getReturnType(checker, mSymbol)
                })
            })

            decorators.forEach(d => {
                docBody.decorators.push(d.getText())
            })

            if (symbol) {
                objectDictionary[docBody.name] = docBody
            }
            // No need to walk any further, class expressions/inner declarations
            // cannot be exported
        }
        else if (ts.isModuleDeclaration(node)) {
            // This is a namespace, visit its children
            ts.forEachChild(node, visit)
        }
    }

    /** True if this is visible outside this file, false otherwise */
    function isNodeExported(node: ts.Node): boolean {
        return (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 || (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
    }
}

let compilerConfig = {
    target: ts.ScriptTarget.ES5, module: ts.ModuleKind.CommonJS
};
let objectDictionary = buildRawTypes(process.argv.slice(2), compilerConfig)
// print out the doc for reference
// TODO: remove
fs.writeFileSync("./.build/api-docs.json", JSON.stringify(objectDictionary, undefined, 4))

// console.log(JSON.stringify(objectDictionary, null, 2))

const getRequestBody = (parameters: string[]): string => {
    const bodyInfoString = _.find(parameters, (value: string, index: number, obj: string[]): boolean => {
        return value.match(Constants.BodyRegex) != null
    })
    if (bodyInfoString === undefined) {
        return
    }
    const bodyMatchInfo = bodyInfoString.match(Constants.BodyRegex)
    return bodyMatchInfo[1]
};

let controllerInfos = Object.keys(objectDictionary).map(key => objectDictionary[key])
    .filter(object => {
        return _.findIndex(object.decorators, (value: string, index: number, obj: string[]): boolean => {
            return value.indexOf("Controller") != Constants.NotFound
        }) != Constants.NotFound
    })
    .map(object => {

        const controllerInfoString = _.find(object.decorators, (value: string, index: number, obj: string[]): boolean => {
            return value.match(Constants.ControllerRegex) != null
        })
        const controllerMatchInfo = controllerInfoString.match(Constants.ControllerRegex)
        if (controllerMatchInfo === undefined) {
            return
        }
        const baseEndpoint = controllerMatchInfo[2].replace(/^"|"$/ig, "")

        const results: Path[] = object.properties.map(property => {
            const pathInfoString = _.find(property.decorators, (value: string, index: number, obj: string[]): boolean => {
                return value.match(Constants.PathRegex) != null
            })
            if (pathInfoString === undefined) {
                return
            }
            const pathMatchInfo = pathInfoString.match(Constants.PathRegex)
            const pathInfo: Path = {
                endpoint: baseEndpoint + pathMatchInfo[2].replace(/^"|"$/ig, ""),
                method: pathMatchInfo[1].toLowerCase(),
                requestBody: getRequestBody(property.parameters),
                successBody: property.returnType
            }
            return pathInfo
        });
        return results
    })

// console.log(JSON.stringify(controllerInfos, null, 2))

let swaggerDoc: Swagger.Document = {
    swagger: "2.0",
    info: {
        title: "My API",
        description: "My API",
        version: "0.0.0"
    },
    host: "localhost:3000",
    paths: {},
    definitions: {}
}
let jsonBodyDictionary = {}

function asJSON(str: string): any | null {
    try {
        return JSON.parse(str)
    } catch (e) {
        return null
    }
}

const extractDefinitionNameFromReturnType = (returnType: string): string => {
    const promiseMatch = returnType.match(/Promise<(\w+(\[\])*|{.*})>/)
    let fixedReturnType: string
    if (promiseMatch != null) {
        fixedReturnType = promiseMatch[1]
    } else {
        fixedReturnType = returnType
    }
    if (fixedReturnType[0] === "{") {
        //create name and store definition, if needed
        if (jsonBodyDictionary[fixedReturnType] == null) {
            const name = `SuccessResponse${Object.keys(jsonBodyDictionary).length}`
            jsonBodyDictionary[fixedReturnType] = name
            let definition: Swagger.Definition = {
                type: "object",
                description: fixedReturnType,
                properties: {}
            }
            swaggerDoc.definitions[name] = definition
        }
        fixedReturnType = jsonBodyDictionary[fixedReturnType]
    }

    return fixedReturnType
}

const createDefinitionIfNeeded = (bodyName: string) => {
    if (swaggerDoc.definitions[bodyName] != null) {
        return swaggerDoc.definitions[bodyName]
    }


    const name = bodyName.replace("[]", "");
    console.log(name)

    let properties: any = {}
    objectDictionary[name].properties.forEach(property => {
        let allowedDefinitionTypes = ["array", "boolean", "integer", "number", "null", "object", "string"]
        let type = property.type.trim()
        if (type === "Date") {
            type = "string"
        } else if (allowedDefinitionTypes.indexOf(type) === Constants.NotFound) {
            type = "object"
        }
        properties[property.name] = { type }
    })
    swaggerDoc.definitions[name] = {
        type: "object",
        properties: properties
    }
}

const appendPath = (path: Path) => {
    let currentPathsInfo = swaggerDoc.paths[path.endpoint]
    if (currentPathsInfo == null) {
        currentPathsInfo = {}
    }

    let newMethod: Swagger.Method = {
        tags: [path.endpoint.split("/")[1]],
        parameters: [],
        responses: {
            "200": {
                description: "Standard Response"
            }
        }
    }

    if (path.requestBody != null) {
        newMethod.parameters.push({
            in: "body",
            name: "body",
            required: true,
            schema: {
                $ref: `#/definitions/${path.requestBody}`
            }
        })
        createDefinitionIfNeeded(path.requestBody)
    }

    if (path.successBody != null) {
        let definitionName = extractDefinitionNameFromReturnType(path.successBody)
        let isArray = false
        if (definitionName.indexOf("[]") != Constants.NotFound) {
            isArray = true
            definitionName = definitionName.replace("[]", "")
        }
        if (definitionName != "void") {
            newMethod.responses["200"] = {
                description: "Success",
                schema: {
                    $ref: `#/definitions/${definitionName}`
                }
            }
            createDefinitionIfNeeded(definitionName)
        }
        if(isArray) {
            newMethod.responses["200"].schema = {
                type: "array",
                items:{
                    $ref: `#/definitions/${definitionName}`
                }
            }
        }
    }

    currentPathsInfo[path.method] = newMethod
    swaggerDoc.paths[path.endpoint] = currentPathsInfo
}

controllerInfos.forEach(controller => {
    controller.forEach(appendPath)
})

console.log(JSON.stringify(swaggerDoc, null, 2))

fs.writeFileSync("./.build/swagger.json", JSON.stringify(swaggerDoc, undefined, 4))