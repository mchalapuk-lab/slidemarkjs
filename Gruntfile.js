module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: ['Gruntfile.js', 'lib/slidemark.js', 'src/**/.js', 'spec/**/*.js'],
    },
    browserify : {
      all: {
        src : ['lib/slidemark.js'],
        dest : "dist/slidemark.js"
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.registerTask('default', ['jshint', 'browserify']);
};

