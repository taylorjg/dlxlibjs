#!/bin/bash

set -euo pipefail

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

(cd "$DIR" && npm run docs)

GH_PAGES_DIR=$DIR/../dlxlibjs-gh-pages

cd "$GH_PAGES_DIR"

git checkout gh-pages
git rm -rf *
cp -R "$DIR/docs/" .
git add -A
git commit -m "Update docs"
git push