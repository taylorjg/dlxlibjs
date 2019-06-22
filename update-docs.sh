#!/bin/bash

set -euo pipefail

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

(cd "$DIR" && rm -rf docs && npm run docs)

GH_PAGES_DIR=$DIR/../dlxlibjs-gh-pages

cd "$GH_PAGES_DIR"

git checkout gh-pages
git rm -rf --ignore-unmatch *
SUBDIR=`ls "$DIR/docs/dlxlib"`
echo SUBDIR=$SUBDIR
cp -R "$DIR/docs/dlxlib/${SUBDIR}/" .
git add -A
git commit -m "[ci skip] Update docs"
git push
