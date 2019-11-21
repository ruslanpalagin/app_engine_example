yarn build
gsutil rsync -d -r build gs://emails.stage-env.info
rm -rf build
