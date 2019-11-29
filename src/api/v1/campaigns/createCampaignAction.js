const knex = require('../../../instances/knex');

const createItem = (receiver, prototype) => {
    return {
        email: receiver.email,
        props: receiver.props,
        ...prototype,
    };
};

module.exports = async (ctx) => {
    const campaign = ctx.request.body.data;
    const { receivers } = campaign;
    const items = receivers.map((receiver) => createItem(receiver, campaign.prototype));
    console.log("items", items);
    const emailRequests = await knex("emailRequests").insert(items);
    console.log("emailRequests", emailRequests);

    ctx.body = {
        data: emailRequests,
    };
};
