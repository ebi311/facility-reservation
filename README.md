※まだ作成中です。

# [プログラミング学習用]施設予約 Web アプリ

## これは何？

Web アプリケーション開発の学習としての、サンプルアプリケーションです。

アプリケーションの目的は、複数のユーザーが会議室や共有備品等の設備の予約管理を行うものです。

Udemy の講座「[【脱初心者向け】実践！Firebase, Typescript, Reactなどを使ったWebアプリ開発ハンズオン](https://www.udemy.com/course/total-web-app-dev/?referralCode=02828A24ACCA747A4B8C)」の資料となります。

##　機能

- 施設の登録・変更
- 施設の予約
- 予約の一覧表示

## 仕様

- [ドキュメント](doc/../docs/index.md)を参照してください。

## 必要条件

- node.js version は、12.0 で確認
- yarn
- Google Firebase の下記の機能を利用するので、そのプロジェクトが必要です。
  - Authorization
  - Cloud Firestore
  - Cloud Functions
  - Hosting

## インストレーション

`yarn install` でインストールしてください。

Firebase のデプロイが必要はずだけど、それはこれから。

## デバッグ

下記コマンドで開発用 Web サーバーが起動します。

```bash
yarn start
```
