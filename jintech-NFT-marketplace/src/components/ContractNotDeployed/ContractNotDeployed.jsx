import React from "react";

const ContractNotDeployed = () => {
  return (
    <div className="jumbotron">
      <h3>Jintech Contract Not Deployed To This Network.</h3>
      <hr className="my-4" />
      <p className="lead">
        Connect Metamask to Localhost 7545(임시, Ganache)
      </p>
    </div>
  );
};

export default ContractNotDeployed;
