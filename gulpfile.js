const gulp = require('gulp');
const gls = require('gulp-live-server');
const exec = require('child_process').exec;

const serverFileName = '.build/api/index.js';

gulp.task('serve', function() {

    const server = gls.new(serverFileName);
    server.start();
 
    gulp.watch(['**/**/**.{ts,js}'], function() {

        console.log('restarting server...')
        exec('npm run build', function (err, stdout, stderr) {
            console.log(stdout);
            console.log(stderr);
            server.start.bind(server)();
        });
    });
});