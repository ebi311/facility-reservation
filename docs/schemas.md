# スキーマ定義

## 概要

本書は [プログラミング学習用]施設予約アプリ における、スキーマ（データ定義）を記載します。

## custom type

| type name         | type   | description                                                                                                              |
| ----------------- | ------ | ------------------------------------------------------------------------------------------------------------------------ |
| id<a id="id"></a> | string | データを一意に判別する文字列。<br />[shortid](https://www.npmjs.com/package/shortid)ライブラリで生成することを想定する。 |
| system            | object | データの共通で持つ情報。下記を参照。                                                                                     |

### system <a id="system"></a>

| item name      | type   | description                  |
| -------------- | ------ | ---------------------------- |
| createDate     | date   | 情報の作成日                 |
| lastUpdate     | date   | 情報の最終更新日             |
| createUser     | string | 作成者の e-mail アドレス     |
| lastUpdateUser | string | 最終更新者の e-mail アドレス |

## 施設 <a id="facility"></a>

| item name   | type              | description                                                       |
| ----------- | ----------------- | ----------------------------------------------------------------- |
| id          | [id](#id)         | 施設を一意に判別する ID。保存時に生成するため新規作成時には不要。 |
| name        | string            | 施設名。128 文字まで                                              |
| description | string            | 施設の説明。改行を含むこともある。1024 文字まで                   |
| system      | [system](#system) | 共通情報                                                          |

## 予約

| item name  | type      | description                                                         |
| ---------- | --------- | ------------------------------------------------------------------- |
| id         | [id](#id) | 予約を一意に判別する ID。保存時に生成するため、新規作成時には不要。 |
| subject    | string    | 予約件名                                                            |
| facilityId | id        | 対象の施設の ID                                                     |
| system     | system    | [共通情報](#system)                                                 |
