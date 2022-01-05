import React from "react";
import { Link } from "react-router-dom";
import "../HomePage.css";

const ProductList = (props) => {
  const { _DATA, Images, TokenPrice } = props;

  return _DATA.currentData().map((val, key) => (
    <div key={key} className="product-pages-list flex-wrap">
      <div className="card-wrap flex-row card">
        {/* 2021.11.26 스타일 이동(div로 한 번 더 묶음 */}
        <Link
          to={{
            pathname: `/nft-detail/${key}`,
            // state: {name: "vikas"}
          }}
        >
          <div className="token-box col-auto">
            {/* 2021.11.26 텍스트 구분 */}
            <img alt="token" className="token" src={Images[key].url} />
          </div>
          <div className="token-box-info token-name">
            Name
            <span className="token-data">{Images[key].name}</span>
          </div>
          <div className="token-box-info token-price">
            Price
            <span className="token-data">
              {Images[key].price * TokenPrice}
              <span className="token-eth">ETH</span>
            </span>
          </div>
          <div className="token-box-info token-id">
            Token ID
            <span className="token-data">{Images[key].token}</span>
          </div>
        </Link>
      </div>
    </div>
  ));
};

export default ProductList;
