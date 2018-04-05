const gulp = require('gulp');
const gls = require('gulp-live-server');
const spawn = require('child_process').spawn;

const serverFileName = '.build/api/index.js';
const pipeOptions = {stdio: 'inherit'}

gulp.task('serve', function() {

    const server = gls.new(serverFileName);
    server.start();
 
    return gulp.watch(['**/**/**.{ts,js}'], {delay: 1200}, function(done) {
        console.log('restarting server...')
        spawn('npm', ['run', 'build'], pipeOptions, function (err, stdout, stderr) {
            server.start.bind(server)();
            done();
        });
    });
});

gulp.task('watch-test', function() {

    spawn('npm', ['test'], pipeOptions);
    
    return gulp.watch(['**/**/**.{ts,js}'], {delay: 1200}, function(done) {
        console.log('re-running tests')
        spawn('npm', ['test'], pipeOptions, () => {
            done();
        });
    });
});