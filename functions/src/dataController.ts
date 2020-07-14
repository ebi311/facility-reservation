import {
  Firestore,
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  DocumentData,
  Query,
  QuerySnapshot,
} from '@google-cloud/firestore';

type CollectionType = 'facilities' | 'reservations';

const firestore = new Firestore();
/**
 * Fire Store
 */
class DataController<T> {
  private collection: CollectionReference;
  /**
   * コンストラクタ
   * @param collectionName コレクション名
   */
  public constructor(collectionName: CollectionType) {
    this.collection = firestore.collection(collectionName);
  }
  /**
   * IDを指定してデータを取得する
   * @param id ドキュメントID
   */
  public async getDocByID(
    id: string,
  ): Promise<
    [
      T | undefined,
      DocumentSnapshot<DocumentData>,
      DocumentReference<DocumentData>,
    ]
  > {
    const docRef = this.collection.doc(id);
    const doc = await docRef.get();
    return [doc.data() as T | undefined, doc, docRef];
  }

  /**
   * データの一覧を取得する
   * @param search 検索文字列
   */
  public async getDocs(
    search?: string,
  ): Promise<[T[], QuerySnapshot<DocumentData>]> {
    let query: CollectionReference | Query = this.collection;
    if (!!search) {
      query = query
        .where('name', '>=', search)
        .where('name', '<=', search + '\uf8ff');
    }
    const docSnapshot = await query.get();
    const docs = (docSnapshot.docs as unknown) as T[];
    return [docs, docSnapshot];
  }
}

export default DataController;
