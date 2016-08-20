/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-npmcopy');
    grunt.loadNpmTasks('grunt-umd');
    grunt.initConfig({
        umd:{
            signalr: {
                src: "wwwroot/libs/signalr/jquery.signalR.min.js",
                dest: "wwwroot/libs/signalr/jquery.signalR.min.umd.js",
                objectToExport: "window.jQuery.signalR",
                deps: {
                    'default': [],
                    amd: [],
                   
                }
            }
        },
        npmcopy: {
            // Anything can be copied 
            libs: {
                options: {
                    destPrefix: 'wwwroot/libs'
                },
                files: {
                    "signalr/": "signalr/**/*.js",
                    "nprogress/": ["nprogress/nprogress.js", "nprogress/nprogress.css"],
                    "bluebird/": "bluebird/js/browser",
                    "component-ajax/": "component-ajax/index.js",
                    "requirejs/": ["requirejs/require.js", "requirejs-text/text.js", "require-css/css.js"],
              
                }
            }
        }
    });
};