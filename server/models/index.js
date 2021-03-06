import Sequelize from "sequelize";

const sequelize = new Sequelize(
    process.env.DATABASE,
    process.env.DB_USER,
    process.env.DB_PASS,
    {
        host: "localhost",
        port: 5432,
        dialect: "postgres"
    }
);

const models = {
    User: sequelize.import("./user"),
    Pet: sequelize.import("./pet"),
    UserProfile: sequelize.import("./userProfile"),
    Post: sequelize.import("./post"),
    Followed_pet: sequelize.import("./followed_pet"),
    Tag: sequelize.import('./tag'),
    UserMessage: sequelize.import('./user_message'),
    Conversation: sequelize.import('./conversation'),
    Message: sequelize.import('./message')
};
Object.keys(models).forEach(key => {
    if ("associate" in models[key]) {
        models[key].associate(models);
    }
});

models.PetTag = sequelize.model('pet_tag')

export { sequelize };
export default models;
