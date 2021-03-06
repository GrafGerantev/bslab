const gulp        = require('gulp');
const browserSync = require('browser-sync');
const sass        = require('gulp-sass');
const cleanCSS    = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename       = require("gulp-rename");
const sourcemaps   = require('gulp-sourcemaps');
const imagemin     = require('gulp-imagemin');
const pngquant     = require('imagemin-pngquant'); // Подключаем библиотеку для работы с PNG
const htmlmin      = require('gulp-htmlmin');
const concat       = require('gulp-concat'); // Подключаем gulp-concat (для конкатенации файлов)
const uglify       = require('gulp-uglifyjs'); // Подключаем gulp-uglifyjs (для сжатия JS
const del          = require('del'); // Подключаем библиотеку для удаления файлов и папок
const cache       = require('gulp-cache'); // Подключаем библиотеку кеширования

gulp.task('server', function() {

    browserSync({
        server: {
            baseDir: "src" //Подставить dist когда будет готово для dist
        }
    });

    gulp.watch("src/*.html").on('change', browserSync.reload);
});

gulp.task('styles', function() {
    return gulp.src("src/sass/**/*.+(scss|sass)")
        .pipe(sourcemaps.init())
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({suffix: '.min', prefix: ''}))
        .pipe(autoprefixer())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(sourcemaps.write())
        /*.pipe(gulp.dest("dist/css"))*/ //Активировать когда будет готово для dist
        .pipe(gulp.dest("src/css"))
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('code', function () {
    return gulp.src("src/js/**/*.js")
        .pipe(browserSync.reload({stream: true}));
});

gulp.task('css', function(){
    return gulp.src([
        'src/css/normalize.css',
        'src/css/font.css',
        'src/css/fontello.css',
        'src/css/jquery.fancybox.min.css',
    ])
        .pipe(concat('_libs.css'))
        .pipe(gulp.dest('src/css'))
        .pipe(browserSync.reload({stream: true}))
});

/*Таск для сборки всех библиотек в один файл*/
gulp.task('scripts', function() {
    return gulp.src([ // Берем все необходимые библиотеки
        'src/libs/**/*.js' // Берем jQuery
        // Берем Magnific Popup
    ])
        .pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
        .pipe(uglify()) // Сжимаем JS файл
        .pipe(gulp.dest('src/js')) // Выгружаем в папку app/js
        .pipe(browserSync.reload({stream: true}));
});

/*Экспорт*/
gulp.task('clean', async function() {
    return del.sync('dist'); // Удаляем папку dist перед сборкой
});

gulp.task('export', function(){
    let buildHtml = gulp.src('src/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));

    let BuildCss = gulp.src('src/css/**/*.css')
        .pipe(gulp.dest('dist/css'));

    let BuildJs = gulp.src('src/js/**/*.js')
        .pipe(gulp.dest('dist/js'));

    let BuildFonts = gulp.src('src/fonts/**/*.*')
        .pipe(gulp.dest('dist/fonts'));

    let BuildImg = gulp.src('src/img/**/*.*')
        .pipe(cache(imagemin({ // С кешированием
            // .pipe(imagemin({ // Сжимаем изображения без кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))/**/)
        .pipe(gulp.dest('dist/img'));
    let BuildIcons = gulp.src('src/icons/**/*.*')
        .pipe(cache(imagemin({ // С кешированием
            // .pipe(imagemin({ // Сжимаем изображения без кеширования
            interlaced: true,
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        })))
        .pipe(gulp.dest('dist/icons'));
});


/*gulp.task('mailer', function () {
    return gulp.src("src/mailer/!**!/!*")
        .pipe(gulp.dest("dist/mailer"));
});*/

gulp.task('watch', function() {
    gulp.watch("src/sass/**/*.+(scss|sass|css)", gulp.parallel('styles'));
    /*gulp.watch("src/!*.html").on('change', gulp.parallel('html'));*/
    gulp.watch("src/js/**/*.js", gulp.parallel("code"));
    gulp.watch(['src/js/script.js', 'src/libs/**/*.js'], gulp.parallel('scripts'));
    /*Активировать, если есть библиотеки Jquery и т.д.*/
});


gulp.task('default', gulp.parallel('styles', 'css', 'code', 'server', 'watch' , 'scripts' /*'fonts', 'icons', 'mailer', 'html', 'images'*/ /*Активировать когда будет готово для dist*/));
gulp.task('build', gulp.parallel('clean', 'export'/*, 'scripts'*/));