var gulp = require( 'gulp' );
var bookmarklet = require( 'gulp-bookmarklet' );
var rename = require( "gulp-rename" );
var del = require( 'del' );

gulp.task( 'bookmarklet', function () {
    return gulp.src( 'GoogleContributionStatsGrabber.js' ) //src('src/*.js')
            .pipe( bookmarklet() )
            .pipe( gulp.dest( 'bookmark', {overwrite: true} ) )
} );

// rename via string
gulp.task( 'rename', function () {
    return gulp.src( "./bookmark/GoogleContributionStatsGrabber.min.js" )
            .pipe( rename( "./GoogleContributionStatsGrabber.bookmark.js" ) )
            .pipe( gulp.dest( "." ) ); // ./dist/main/text/ciao/goodbye.md
} );

gulp.task( 'cleanOld', function () {
    return del( ["./GoogleContributionStatsGrabber.bookmark.js"] );
} );

gulp.task( 'cleanTemp', function () {
    return del( ["./bookmark"] );
} );


// Default Task
gulp.task( 'default', ['cleanOld', 'bookmarklet', 'rename', 'cleanTemp'] );