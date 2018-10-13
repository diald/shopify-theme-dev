Shopify Theme Dev
=========================

Dependencies
------------

-   Shopify Theme Kit: <https://shopify.github.io/themekit/#installation>

-   NodeJS: <https://nodejs.org/en/>

Project Structure
-----------------

| Folder  | Type               | Purpose                                                                                                                             |
|---------|--------------------|-------------------------------------------------------------------------------------------------------------------------------------|
| /~/dist | Distro Folder      | Generated folder and contents of Shopify theme. This folder’s contents are a 1-for-1 copy of the theme files on the Shopify server. |
| /~/src  | Code Source Folder | All development files. These files get compiled and copied to the /~/dist folder with gulp                                          |
|         |                    |                                                                                                                                     |

Local Dev setup
---------------

Open a command prompt or terminal in the project folder root.

Install the node dependencies.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bash
npm install
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

After npm installs dependent node modules, create an inital distro build.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bash
gulp
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

This gulp task will render a Shopify Theme build in the `~/dist` directory. Git
should ignore this directory and it's contents. Do not commit these files.

Run the project locally.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bash
gulp dev
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

BrowserSync will provide access URLs for local development.

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bash
Local: https://localhost:3000/?preview_theme_id=14819917879
External: https://[your external IP address]:3000/?preview_theme_id=14819917879
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

### Gulp Tasks

**Build a Distro**

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bash
gulp
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Run Local Dev**

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bash
gulp dev
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Clean Local Project**

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bash
gulp clean
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

**Purge Remote Theme Files (CAUTION: This will delete your entire theme from the
Shopify server.)**

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bash
gulp purge
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Deployment
----------

The gulp tasks do some basic syncing during development with the `gulp dev` or
`gulp watch` command, but sometimes you may need to push or pull the entire
theme to Shopify servers. One or more conditions that warrant a push or pull,
may include:

-   Shopify returns a `422 unprocessable entity` error during a file sync

    -   `422 unprocessable entity` error can be caused by either a missing file
        or syntax error in a Liquid file.

-   You've completed a `gulp purge` and theme files are missing from Shopify
    server

-   Assets (CSS, images, or fonts) are not being pushed to the server during a
    sync

To help alleviate these issues, you can run these in a terminal:

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bash
gulp clean
gulp
cd dist
theme download
theme upload
cd ../
gulp
cd dist
theme upload
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

### Download theme files

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bash
cd dist
theme download
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

### Upload theme files

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ bash
cd dist
theme upload
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
