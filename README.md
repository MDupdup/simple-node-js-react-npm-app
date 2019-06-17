# simple-node-js-react-npm-app

This repository is for the
[Build a Node.js and React app with npm](https://jenkins.io/doc/tutorials/build-a-node-js-and-react-app-with-npm/)
tutorial in the [Jenkins User Documentation](https://jenkins.io/doc/).

The repository contains a simple Node.js and React application which generates
a web page with the content "Welcome to React" and is accompanied by a test to
check that the application renders satisfactorily.

The `jenkins` directory contains an example of the `Jenkinsfile` (i.e. Pipeline)
you'll be creating yourself during the tutorial and the `scripts` subdirectory
contains shell scripts with commands that are executed when Jenkins processes
the "Test" and "Deliver" stages of your Pipeline.
dqsdqsdqsd


## KOMEKON Fé

### Webhook sur github
 * https://github.com/KirianCaumes/simple-node-js-react-npm-app/settings/hooks
 * Add webhook
```sh
ngrok.exe http 8082
```

### Jenkins
 * New Item > Multibranch Pipeline
 * Branch Sources / Github => Creditentials (mettre sur user github), Owner "KirianCaumes", Repo "simple-node..." => Behaviors : Discover branches : "Exlude ..." & Filter by name, include "master"
 
### Test

```sh
git add . | git commit -m "test" | git push
```