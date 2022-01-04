pragma solidity >0.5.0;

import "../openzeppelin/token/ERC721/extensions/ERC721Full.sol";
import "../openzeppelin/token/ERC721/extensions/IERC721Metadata.sol";

contract ImageContract is IERC721Metadata, ERC721Full {
    /**
    2021-11-15 파일 구분을 위해 string hash 를 추가
   */
    struct metadata {
        string name;
        string description;
        string url;
        uint256 price;
        string token;
    }

    string[] public images;
    mapping(uint256 => metadata) public imageData;
    mapping(string => bool) _imageExists;

    mapping(uint256 => bool) _listedForAuction;
    mapping(uint256 => bool) _listedForSale;

    struct auctionData {
        uint256 price;
        uint256 time;
    }
    mapping(uint256 => auctionData) tokenAuction;

    constructor() public ERC721("Image_NFT", "IMG") {}

    /**
    upate : 2021-11-15
    metadata 에 hash 가 추가 됨에 따라 파일 수정
   */
    function mint(
        string memory _name,
        string memory _description,
        string memory _url,
        uint256 _price,
        string memory _hash
    ) public returns (uint256) {
        require(!_imageExists[_url]);
        require(!_imageExists[_hash], "ERC721: token already minted");
        metadata memory md;
        md.name = _name;
        md.description = _description;
        md.url = _url;
        md.price = _price;
        md.token = _hash; //hash 를 추가 함

        //images.push(_url); //_url 로 구분하는 것을 막기 위해 주석 처리 하고
        images.push(_hash); //_hash 로 구분 하도록 변경
        uint256 _id = images.length - 1;
        imageData[_id] = md;
        _mint(msg.sender, _id);
        //_imageExists[_url] = true;  //_url 로 구분하는 것을 막기 위해 주석 처리 하고
        _imageExists[_hash] = true; //_hash 로 구분 하도록 변경

        return _id;
    }

    function approveNFT(address _to, uint256 _tokenId) public {
        approve(_to, _tokenId);
    }

    function isApprovedOrOwner(address _address, uint256 _tokenId)
        public
        returns (bool)
    {
        return _isApprovedOrOwner(_address, _tokenId);
    }

    function updatePrice(uint256 _id, uint256 _price) public returns (bool) {
        require(ownerOf(_id) == msg.sender);
        imageData[_id].price = _price;

        return true;
    }

    function approveForSale(
        address _to,
        uint256 _tokenId,
        uint256 _price
    ) public {
        require(_listedForAuction[_tokenId] == false);
        _listedForSale[_tokenId] = true;
        updatePrice(_tokenId, _price);
        approveNFT(_to, _tokenId);
    }

    function approveForAuction(
        address _to,
        uint256 _tokenId,
        uint256 _price,
        uint256 _time
    ) public {
        require(_listedForSale[_tokenId] == false);
        _listedForAuction[_tokenId] = true;
        // updatePrice(_tokenId, _price);
        approveNFT(_to, _tokenId);

        auctionData memory ad;
        ad.price = _price;
        ad.time = _time;

        tokenAuction[_tokenId] = ad;
    }

    function nftSold(uint256 _tokenId) public {
        _listedForSale[_tokenId] = false;
        _listedForAuction[_tokenId] = false;
    }
}
