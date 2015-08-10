# Website for Cloud Mobile Computing Workshop

# Deployment

* Setup the http server to statically serve files under some folder
* Copy all files under dist/ to that folder 

[Demo](http://cmcw2015.stieizc.info/)

# Development

## Main Dependencies

See [package.json](package.json)

* Jade
* Stylus
* Browserify

## Setup

    ```shell
    # Example npm & bower setup.
    ./scripts/setup-develop.sh
    node install
    bower install
    ```

## Rebuild

    ```shell
    gulp dist
    ```

## Browser Sync

    ```shell
    gulp
    # or gulp develop
    ```

# Contact

Bug reports and stuffs can go to [stieizc.33@gmail.com](stieizc.33@gmail.com)
