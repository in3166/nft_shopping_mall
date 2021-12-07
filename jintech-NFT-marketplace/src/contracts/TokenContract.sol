pragma solidity >0.5.0;

import "../openzeppelin/token/ERC20/ERC20.sol";

contract TokenContract is ERC20 {
                  // ETK 기호를 사용해 bizon Token 생성
  constructor() ERC20("Ebizon Token", "ETK") public {}

  function mint(address account, uint256 amount) public returns (bool) {
    _mint(account, amount);
    //  _mint(block.coinbase, 20);
    // 블록 채굴자인 block.coinbase는 이 블록을 채굴하기 위헤 20 ETK 토큰을 수신하고 이벤트를 보냄
    return true;
  }

}
