const knex = require('../../../instances/knex');
const campaignsRepository = require('../../../repositories/campaignsRepository');

const createItem = (receiver, prototype) => {
    return {
        email: receiver.email,
        props: receiver.props,
        ...prototype,
    };
};

module.exports = async (ctx) => {
    const campaignAttrs = ctx.request.body.data;
    const { receivers } = campaignAttrs;

    const campaign = await campaignsRepository.createAndGet({ creatorUserId: ctx.currentUser.id });
    console.log("campaign", campaign);

    const prototype = {
        ...campaignAttrs.prototype,
        creatorUserId: ctx.currentUser.id,
        campaignId: campaign.id,
    };
    const items = receivers.map((receiver) => createItem(receiver, prototype));
    // console.log("items", items);
    const emailRequests = await knex("emailRequests").insert(items);
    // console.log("emailRequests", emailRequests);

    ctx.body = {
        data: emailRequests,
    };
};
