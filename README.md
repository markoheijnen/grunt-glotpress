# grunt-glotpress

> Gets translations from a GlotPress installation

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-glotpress --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-glotpress');
```

## The "glotpress_download" task

### Overview
In your project's Gruntfile, add a section named `glotpress_download` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  glotpress_download: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.domainPath
Type: `String`
Default value: `languages`

The folder where all downloaded files will be stored

#### options.url
Type: `String`
Default value: `false`

The url of the GlotPress installation (required).

#### options.slug
Type: `String`
Default value: `false`

The slug is the path in the GlotPress installation which can also be main-folder/sub-folder (required).

#### options.textdomain
Type: `String`
Default value: `false`

The textdomain that is used for WordPress. This is needed for the files. If not set, it will fallback to the slug.

#### options.file_format
Type: `String`
Default value: `%domainPath%/%textdomain%-%wp_locale%.%format%`

The structure how the file is being stored. Is based on previous settings but you could create your own format.
For now only those four values and short locale can be used. You could however save the files in different folders if you move a placeholder.

#### options.formats
Type: `Array`
Default value: `['po','mo']`

The file formats that will be downloaded for each translation set.

#### options.filter
Type: `object`
Default value: `{translation_sets: false, minimum_percentage: 30, waiting_strings: false}`

You can filter which files you want to have. By default it only checks the minimum percentage translation sets need to be translated.
The other parameters still need to be implemented.

#### options.batchSize
Type: `Number`
Default value: `-1`

You can limit the amount of files being downloaded at one time. Set to `-1` for no limit.


### Usage Examples

#### Default Options
In this example, the default options are used to download all translations sets from a project.

```js
grunt.initConfig({
  glotpress_download: {
    core: {
      options: {
        domainPath: 'languages',
        url: 'http://wp-translate.org',
        slug: 'tabify-edit-screen',
        textdomain: 'tabify-edit-screen',
      }
    },
  },
});
```

#### Default Options
In this example, we add our own file format like for a theme. By default the format is set for plugins which do include the textdomain.

```js
grunt.initConfig({
  glotpress_download: {
    core: {
      options: {
        domainPath: 'languages',
        url: 'http://wp-translate.org',
        slug: 'cool-theme',
        textdomain: 'cool-theme',
        file_format: '%domainPath%/%wp_locale%.%format%',
      }
    },
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
- 0.2.2 - Add CWD support.
- 0.2.1 - Fix broken download of translation files.
- 0.2.0 - Complete rewrite of the codebase.
          Add ability to include waiting strings.
          Fallback to locale if wp_locale doesn't exists.
          Fixes encoding issue where downloadeded files didn't work.
          Further coding style fixes.
- 0.1.1 - Fix dependency and downloading issues.
- 0.1.0 - Initial Release.
