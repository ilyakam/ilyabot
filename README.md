# Ilyabot

The bot that would ultimately replace me

---

## Prerequisites

1. [brew](http://brew.sh)

  ```sh
  ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
  ```

1. [HubFlow](http://datasift.github.io/gitflow/)

  ```sh
  brew install hubflow
  ```

1. [node](http://nodejs.org/)

  ```sh
  brew install node
  ```

---

## Setup

1. `git clone git@github.com:ilyakam/ilyabot.git`
1. `cd ilyabot`
1. `npm install`
1. `git hf init`

---

## Workflow

* To run the app locally

  ```sh
  node server.js
  ```

* To test

  ```sh
  npm run test
  ```

* To lint

  ```sh
  npm run lint
  ```
