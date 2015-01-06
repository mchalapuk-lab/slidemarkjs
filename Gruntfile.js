module.exports = function(grunt) {
  grunt.initConfig({
    jasmine : {
      pivotal : {
        src : 'src/**/*.js',
        options: {
          specs : 'specs/**/*spec.js',
          helpers : 'specs/helpers/*.js'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.registerTask('default', 'jasmine');
};

