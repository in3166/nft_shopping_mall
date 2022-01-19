const db = require("../models");
const config = require("../config/auth.config");
const Op = db.Sequelize.Op;
const multerFile = require("../middleware/multerFile");
const Marketplace = db.marketplace;
const MarketHistories = db.marketHistory;
const Images = db.image;
var fs = require("fs");

// 경매 낙찰
async function endTimeOrSoldOut(params) {
  console.log("endTimeOrSoldOut run");
  try {
    // market에 올라와 있는 이미지 목록
    const marketImages = await Marketplace.findAll({
      where: {
        onMarket: true,
      },
      include: [
        {
          model: db.users,
          attributes: ["email", "address"],
          as: "owner",
        },
        {
          model: db.image,
          attributes: [
            "filename",
            "type",
            "url",
            "price",
            "period",
            "type",
            "buyout",
            "markup",
            "key",
            "onMarket",
            "categoryId",
          ],
        },
      ],
    });

    if (marketImages.length < 1) {
      return;
    }

    // 시간 초과 이미지 목록
    const EndTimeImages = marketImages.filter((value) => {
      // 끝나는 시간
      const endTime =
        new Date(value.starting_time).getTime() +
        value.limit_hours * 60 * 60 * 1000; // 시간을 milliesecond로 변환

      // 판매 시간이 남아있는 제품 목록
      if (endTime < Date.now()) return true;
      return false;
    });

    console.log("EndTimeImages: ", EndTimeImages);

    if (EndTimeImages.length < 1) return { error: false };

    // 시간 초과된 이미지들 중
    const promises = [];
    for (let i = 0; i < EndTimeImages.length; i++) {
      const newMarketPlacePromise = Marketplace.update(
        {
          onMarket: false,
          soldOut: false,
          ownerEmail:
            EndTimeImages[i].buyerEmail !== null
              ? EndTimeImages[i].buyerEmail
              : EndTimeImages[i].ownerEmail,
          buyerEmail: null,
        },
        {
          where: { id: EndTimeImages[i].id },
        }
      );

      // 구매자가 있을 경우(경매 참여자) 히스토리에 추가
      if (EndTimeImages[i].buyerEmail !== null) {
        const newMarketHistoryPromise = MarketHistories.create({
          action: "sale",
          price: EndTimeImages[i].current_price,
          marketplaceId: EndTimeImages[i].id,
          userEmail: EndTimeImages[i].ownerEmail,
          starting_time: EndTimeImages[i].starting_time,
        });

        const newMarketHistoryBuyPromise = MarketHistories.create({
          action: "buy",
          price: EndTimeImages[i].current_price,
          marketplaceId: EndTimeImages[i].id,
          userEmail: EndTimeImages[i].buyerEmail,
          starting_time: EndTimeImages[i].starting_time,
        });
        promises.push(newMarketHistoryPromise);
        promises.push(newMarketHistoryBuyPromise);
      }

      promises.push(newMarketPlacePromise);
    }
    console.log("promises: ", promises);
    const resPromiseAll = await Promise.all(promises);
    console.log("resPromiseAll: ", resPromiseAll);
    return { error: false, resPromiseAll };
  } catch (error) {
    console.log("end time images false error: ", error);
    return { error: true, message: error };
  }
}

exports.create = async (req, res) => {
  const body = req.body;
  console.log("body: ", body);

  Marketplace.create(body)
    .then((createData) => {
      console.log("createData: ", createData);

      return res.status(200).json({
        success: true,
        //url: res.req.file.path,
        msg: "상품 등록을 성공했습니다.",
      });
    })
    .catch((err) => {
      console.log("db err: ", err);
      return res.status(400).json({ success: false, err, message: err });
    });
};

var path = require("path");
const { users, images } = require("../models");

exports.findOne = (req, res) => {
  const id = req.params.id;
  console.log("goods: ", id);
  Marketplace.findOne({
    where: { id },
    include: [
      // { association: "owner" },
      {
        model: db.users,
        attributes: ["email", "address"],
        as: "owner",
      },
      {
        model: db.image,
        attributes: [
          "categoryId",
          "filename",
          "type",
          "url",
          "price",
          "period",
          "type",
          "buyout",
          "markup",
          "key",
          "onMarket",
          "description",
          "id",
        ],
      },
    ],
  })
    .then((info) => {
      console.log("return :", info);
      return res.status(200).json({ success: true, info: info });
    })
    .catch((err) => {
      console.log("err: ", err);
      return res.status(400).json({ success: false, err, message: err });
    });
};

exports.findAll = (req, res) => {
  Marketplace.findAll({
    include: [
      {
        model: db.users,
        attributes: ["email", "address"],
        as: "owner",
      },
      {
        model: db.image,
        attributes: [
          "filename",
          "type",
          "url",
          "price",
          "period",
          "type",
          "buyout",
          "markup",
          "key",
          "onMarket",
          "categoryId",
        ],
      },
    ],
  })
    .then((images) => {
      res.status(200).send({ success: true, images: images });
    })
    .catch((err) => {
      res.status(400).send({ success: false, error: err, message: err });
    });
};

exports.findAllOnMarket = (req, res) => {
  //var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;
  console.log("findall");

  Marketplace.findAll({
    where: {
      onMarket: true,
    },
    include: [
      {
        model: db.users,
        attributes: ["email", "address"],
        as: "owner",
      },
      {
        model: db.image,
        attributes: [
          "filename",
          "type",
          "url",
          "price",
          "period",
          "type",
          "buyout",
          "markup",
          "key",
          "onMarket",
          "categoryId",
        ],
      },
    ],
  })
    .then(async (images) => {
      const endTimeRes = await endTimeOrSoldOut();
      console.log(endTimeRes.error, "error?");
      if (endTimeRes.error)
        return res
          .status(500)
          .send({ error: endTimeRes.message, message: endTimeRes.message });
      console.log("images: ", images);
      res.status(200).send({ success: true, images });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving Users.",
      });
    });
};
// 경매 페이지, my images 페이지 둘 다 load 할 때, action 취하기 위해 나눔
exports.findAllMyImages = async (req, res) => {
  const email = req.params.email;
  console.log("findAllMyImages");
  try {
    const endTimeRes = await endTimeOrSoldOut();
    if (endTimeRes.error)
      return res
        .status(500)
        .send({ error: endTimeRes.message, message: endTimeRes.message });

    // 판매된 이미지의 소유자 변경 (buyer => owner)
    // const SoldOut = await Marketplace.findAll({ where: { soldOut: true } });
    // console.log(SoldOut);
    // if (SoldOut.length > 0) {
    //   console.log("SoldOut: ", SoldOut[0].buyerEmail);
    //   console.log("SoldOut: ", SoldOut[0].id);

    //   let promises = [];
    //   for (let i = 0; i < SoldOut.length; i++) {
    //     let newPromise = Marketplace.update(
    //       {
    //         ownerEmail: SoldOut[i].buyerEmail,
    //         buyerEmail: null,
    //         soldOut: false,
    //       },
    //       { where: { id: SoldOut[i].id } }
    //     );
    //     let newHistoryPromise = MarketHistory.create({
    //       action: "sale",
    //       price: SoldOut[i].current_price,
    //       userEmail: SoldOut[i].ownerEmail,
    //       marketplaceId: SoldOut[i].id,
    //       starting_time: SoldOut[i].starting_time,
    //     });

    //     promises.push(newPromise);
    //     promises.push(newHistoryPromise);
    //   }

    //   const promiseAll = await Promise.all(promises);
    //   if (promiseAll) {
    //     console.log(promiseAll);
    //   }
    // }

    const myAllImages = await Marketplace.findAll({
      where: { ownerEmail: email },
      include: [
        {
          model: db.users,
          attributes: ["email", "address"],
          as: "owner",
        },
        {
          model: db.image,
          attributes: [
            "filename",
            "type",
            "url",
            "price",
            "period",
            "type",
            "buyout",
            "markup",
            "key",
            "onMarket",
            "categoryId",
          ],
        },
      ],
    });

    // console.log("myAllImages: ", myAllImages);
    res.status(200).send({ success: true, images: myAllImages });

    // .then((images) => {
    //   res.status(200).send({ success: true, images });
    // })
    // .catch((err) => {
    //   console.log(err);
    //   res.status(500).send({
    //     message: err.message || "Some error occurred while retrieving Users.",
    //   });
    // });
  } catch (error) {
    console.log("err: ", error);
    res.status(500).send({
      message: error || "Some error occurred while retrieving Images.",
      error: error,
    });
  }
};

exports.update = async (req, res) => {
  //var condition = email ? { email: { [Op.iLike]: `%${email}%` } } : null;
  console.log("update", req.body);

  const marketData = {
    type: req.body.type,
    starting_time: req.body.starting_time,
    limit_hours: req.body.limit_hours,
    current_price: req.body.current_price,
    onMarket: true,
    soldOut: false,
    buyerEmail: null,
  };

  let imageData;

  if (marketData.type === "auction") {
    imageData = {
      type: req.body.type,
      price: req.body.current_price,
      buyout: req.body.buyout,
      markup: req.body.markup,
      period: req.body.limit_hours,
      description: req.body.description,
      categoryId: req.body.categoryId === 0 ? null : req.body.categoryId,
    };
  } else {
    imageData = {
      type: req.body.type,
      price: req.body.current_price,
      period: req.body.limit_hours,
      description: req.body.description,
      categoryId: req.body.categoryId === 0 ? null : req.body.categoryId,
    };
  }
  console.log("imageData: ", imageData);

  const historyData = {
    action: "register",
    price: req.body.current_price,
    marketplaceId: req.body.id,
    userEmail: req.body.email,
    starting_time: req.body.starting_time,
  };
  console.log("historyData: ", historyData);
  try {
    await Images.update(imageData, { where: { id: req.body.imageId } });
    await Marketplace.update(marketData, {
      where: { id: req.body.id },
    });
    await MarketHistories.create(historyData);
    res.status(200).send({ success: true });
  } catch (error) {
    console.log("Re-register error: ", error);
    res.status(500).send({ message: error, error: error });
  }

  // .then((num) => {
  //   console.log(num);
  //   res.status(500).send({ success: true });
  // })
  // .catch((err) => {
  //   console.log("err: ", err);
  //   res.status(500).send({ message: err, error: err });
  // });
};

exports.endtime = (req, res) => {
  const id = req.body.id;
  Marketplace.update(
    { onMarket: false },
    {
      where: { id },
    }
  )
    .then((data) => {
      console.log;
    })
    .cathch((err) => {});
};
