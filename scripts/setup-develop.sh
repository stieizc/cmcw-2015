#!/bin/bash

BASEDIR=$(realpath "$(dirname ${BASH_SOURCE[0]})/..")
INSTANCE=${BASEDIR}/instance
DIST=${BASEDIR}/dist
if [[ ! -e $INSTANCE ]]
then
    mkdir $INSTANCE
    for f in ${DIST}/{*.gif,*.png}
    do
        ln -s $f $INSTANCE
    done
fi
