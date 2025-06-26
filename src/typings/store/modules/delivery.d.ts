declare namespace StoreState {
  /** Delivery模块 */
  type Delivery = {
    deliveryList: { text: string }[];
    worksSourceList: { label: string; value: string }[];
    deliverHistoryParams: Fetch.IQueryDeliverHistoryParamsRes;
    randomInspire: Fetch.IQueryRandomInspireRes;
    imagePage: Fetch.IQuerySelfMaterialRes;
    imageMarked: Fetch.IQueryImagePageResM;
  };
}
