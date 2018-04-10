import * as React from 'react'
import { getStylesString } from './emailStyles'

interface EmailProps {
    type: 'default' | 'primary' | 'success' | 'info' | 'warning' | 'danger'

    heading: string
    body: string

    image?: string
    linkUrl?: string
    linkTitle?: string
}

function ImageTag(props: EmailProps) {
    if (!props.image) { return null }
    return <img className="image_fix" src={props.image} />
}

function LinkTag(props: EmailProps) {
    if (!props.linkUrl) { return null }
    return <a href={props.linkUrl} target="_blank" title="Styling Links">
        {props.linkTitle || props.linkUrl}
    </a>
}

export default function EmailTemplate(props: EmailProps) {
    return (
        <html>
            <head>
                <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{props.heading}</title>
                <style type="text/css">{getStylesString()}</style>
            </head>
            <body>
                <table cellPadding="0" cellSpacing="0" id="backgroundTable">
                    <tr>
                        <td>
                            <table cellPadding="0" cellSpacing="0">
                                <tr>
                                    <td>
                                        <h2>{props.heading}</h2>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <p>{props.body}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <LinkTag {...props} />
                                        <ImageTag {...props} />
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
            </body>
        </html>
    )
}