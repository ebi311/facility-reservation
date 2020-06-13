# [プログラミング学習用]施設予約アプリ 機能仕様書

## 概要

本書は、[プログラミング学習用]施設予約アプリ における、機能ごとの仕様を記載したものである。

## API（サーバー機能）

### 新しい施設の登録

#### メソッド

POST

#### URL

/facilities/

#### クエリパラメータ

なし

#### リクエスト・Body

content-type: application/json

| item name   | requierd | value          |
| ----------- | :------: | -------------- |
| name        |    ✔     | string: 施設名 |
| description |          | strng: 詳細    |

### レスポンス

status: 200

content-type: application/json

登録後の[施設](./schemas.md#facility)のデータを返す。

### 施設の更新

#### メソッド

POST

#### URL

/facilities/{id}

#### クエリパラメータ

| item name | value                     |
| --------- | ------------------------- |
| id        | string: 更新する施設の ID |

#### リクエスト・Body

content-type: application/json

| item name   | value          |
| ----------- | -------------- |
| name        | string: 施設名 |
| description | strng: 詳細    |
