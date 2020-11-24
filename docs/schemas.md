# スキーマ定義

## 概要

本書は [プログラミング学習用]設備予約アプリ における、スキーマ（データ定義）を記載します。

## custom type

| type name         | type   | description                                                                                                              |
| ----------------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| id<a id="id"></a> | string | データを一意に判別する文字列。<br />[shortid](https://www.npmjs.com/package/shortid)ライブラリで生成することを想定する。 |
| system            | object | データの共通で持つ情報。下記を参照。                                                                                     |

> 日付型 について
> JSON には日付型がないため、ISO 8601 形式(UTC)の文字列とする。

### system <a id="system"></a>

| item name      | type   | description                  |
| -------------- | ------ | ---------------------------- |
| createDate     | date   | 情報の作成日                 |
| lastUpdate     | date   | 情報の最終更新日             |
| createUser     | string | 作成者の e-mail アドレス     |
| lastUpdateUser | string | 最終更新者の e-mail アドレス |

## 設備 <a id="facility"></a>

| item name   | type              | description                                                       |
| ----------- | ----------------- | ----------------------------------------------------------------- |
| id          | [id](#id)         | 設備を一意に判別する ID。保存時に生成するため新規作成時には不要。 |
| name        | string            | 設備名。128 文字まで                                              |
| description | string            | 設備の説明。改行を含むこともある。1024 文字まで                   |
| system      | [system](#system) | 共通情報                                                          |

## 予約 <a id="reservation"></a>

| item name   | type      | description                                                         |
| ----------- | --------- | ------------------------------------------------------------------- |
| id          | [id](#id) | 予約を一意に判別する ID。保存時に生成するため、新規作成時には不要。 |
| subject     | string    | 予約件名 128 文字まで                                               |
| facilityId  | id        | 対象の設備の ID                                                     |
| description | string    | 予約の詳細な説明 1024 文字まで                                      |
| startDate   | date      | 利用開始日時                                                        |
| endDate     | date      | 利用終了日時                                                        |
| system      | system    | [共通情報](#system)                                                 |

## エラーレスポンス

| item name | type    | description      |
| --------- | ------- | ---------------- |
| code      | string  | エラーコード     |
| message   | string  | エラーメッセージ |
| errors    | Error[] | エラーの一覧     |

## バリデーション・エラー(ValidationError)

※ Error オブジェクトから継承される

| item name | type   | description              |
| --------- | ------ | ------------------------ |
| itemName  | string | エラー対象の項目名       |
| code      | string | エラーの内容を表すコード |
| message   | string | エラーのメッセージ       |
