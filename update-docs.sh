#!/bin/bash

set -euo pipefail

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

(cd "$DIR" && rm -rf doc && npm run doc)

GH_PAGES_DIR=$DIR/../dlxlibjs-gh-pages

cd "$GH_PAGES_DIR"

git checkout gh-pages
git rm -rf --ignore-unmatch *
SUBDIR=`ls "$DIR/doc/dlxlib"`
echo SUBDIR=$SUBDIR
cp -R "$DIR/doc/dlxlib/${SUBDIR}/" .
git add -A
git commit -m "[ci skip] Update doc"
git push
