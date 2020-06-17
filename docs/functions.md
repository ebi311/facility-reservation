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

| item name   | required | value          |
| ----------- | :------: | -------------- |
| name        |    ✔     | string: 施設名 |
| description |          | string: 詳細   |

#### レスポンス: 成功時

status: 200

content-type: application/json

登録後の[施設](./schemas.md#facility)のデータを返す。

#### レスポンス: インプット・エラー

リクエストデータが、スキーマ定義にある制約に違反している場合。

status: 422

content-type: application/json

| item name | type              | description      |
| --------- | ----------------- | ---------------- |
| code      | string            | エラーコード     |
| message   | string            | エラーメッセージ |
| errors    | ValidationError[] | エラーの一覧     |

### 施設の更新

#### メソッド

PUT

#### URL

/facilities/{id}

#### パスパラメータ

| item name | required | value                     |
| --------- | :------: | ------------------------- |
| id        |    ✔     | string: 更新する施設の ID |

#### リクエスト・Body

content-type: application/json

| item name   | required | value          |
| ----------- | :------: | -------------- |
| name        |          | string: 施設名 |
| description |          | string: 詳細   |

Body にない項目は更新されない。

#### レスポンス: 成功

status: 200

content-type: application/json

変更後の[施設](./schemas.md#facility)のデータを返す。

#### レスポンス: 指定した ID の施設がない

status: 404

body: なし

#### レスポンス: インプット・エラー

status: 422

content-type: application/json

| item name | type              | description      |
| --------- | ----------------- | ---------------- |
| code      | string            | エラーコード     |
| message   | string            | エラーメッセージ |
| errors    | ValidationError[] | エラーの一覧     |

### 施設の削除

#### メソッド

DELETE

#### URL

/facilities/{id}

#### パスパラメータ

| item name | required | value                     |
| --------- | :------: | ------------------------- |
| id        |    ✔     | string: 更新する施設の ID |

#### レスポンス: 成功

status code: 204

#### レスポンス: 指定した ID の施設がない

status: 404

body: なし

### 施設の取得

#### メソッド

GET

#### URL

/facilities/{id}

#### パスパラメータ

| item name | required | value                     |
| --------- | :------: | ------------------------- |
| id        |    ✔     | string: 更新する施設の ID |

#### レスポンス: 成功

status: 200

content-type: application/json

[施設](./schemas.md#facility)のデータを返す。

#### レスポンス: 指定した ID の施設がない

status: 404

### 予約の登録

#### メソッド

POST

#### URL

/reservations/

#### リクエスト・Body

content-type: application/json

| item name   | required | value          |
| ----------- | :------: | -------------- |
| subject     |    ✔     | string: 予約名 |
| facilityId  |    ✔     | id: 施設 ID    |
| description |          | string: 詳細   |
| startDate   |    ✔     | date: 開始日   |
| endDate     |    ✔     | date: 終了日   |

#### レスポンス: 成功時

status: 200

content-type: application/json

登録後の[予約](./schemas.md#reservation)のデータを返す。

#### レスポンス: インプット・エラー

status: 422

content-type: application/json

| item name | type              | description      |
| --------- | ----------------- | ---------------- |
| code      | string            | エラーコード     |
| message   | string            | エラーメッセージ |
| errors    | ValidationError[] | エラーの一覧     |

### 予約の更新

#### メソッド

PUT

#### URL

/reservations/{id}

#### パスパラメータ

| item name | required | value                     |
| --------- | :------: | ------------------------- |
| id        |    ✔     | string: 更新する予約の ID |

#### リクエスト・Body

content-type: application/json

| item name   | required | value          |
| ----------- | :------: | -------------- |
| subject     |          | string: 予約名 |
| facilityId  |          | id: 施設 ID    |
| description |          | string: 詳細   |
| startDate   |          | date: 開始日   |
| endDate     |          | date: 終了日   |

Body にない項目は更新されない。

#### レスポンス: 成功時

status: 200

content-type: application/json

更新後の[予約](./schemas.md#reservation)のデータを返す。

#### レスポンス: 指定した ID の施設がない

status: 404

body: なし

#### レスポンス: インプット・エラー

status: 422

content-type: application/json

| item name | type              | description      |
| --------- | ----------------- | ---------------- |
| code      | string            | エラーコード     |
| message   | string            | エラーメッセージ |
| errors    | ValidationError[] | エラーの一覧     |

### 予約の削除

#### メソッド

DELETE

#### URL

/reservations/{id}

#### パスパラメータ

| item name | required | value                     |
| --------- | :------: | ------------------------- |
| id        |    ✔     | string: 更新する施設の ID |

#### レスポンス: 成功

status code: 204

#### レスポンス: 指定した ID の予約がない

status: 404

body: なし

### 予約の取得

#### メソッド

GET

#### URL

/reservations/{id}

#### パスパラメータ

| item name | required | value                     |
| --------- | :------: | ------------------------- |
| id        |    ✔     | string: 更新する施設の ID |

#### レスポンス: 成功

status code: 200

content-type: application/json

[予約](./schemas.md#reservation)のデータを返す。

#### レスポンス: 指定した ID の予約がない

status: 404

body: なし

### 予約一覧を取得する

#### メソッド

GET

#### URL

/reservations/

#### クエリパラメータ

| item name   | required | value                                 |
| ----------- | :------: | ------------------------------------- |
| date        |    ✔     | date: 予約を取得する日付              |
| facilityIds |          | string カンマ区切り: 施設の ID の一覧 |

#### レスポンス: 成功

status code: 200

content-type: application/json

[予約](./schemas.md#reservation)のデータを返す。

#### レスポンス: クエリパラメータが不正

status: 422

content-type: application/json

| item name | type              | description      |
| --------- | ----------------- | ---------------- |
| code      | string            | エラーコード     |
| message   | string            | エラーメッセージ |
| errors    | ValidationError[] | エラーの一覧     |
