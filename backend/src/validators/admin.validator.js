const Joi = require('joi'); // assuming joi is installed; otherwise use basic checks

const contentSchema = Joi.object({
  room_id: Joi.string().uuid().required(),
  content_type_id: Joi.string().uuid().required(),
  title: Joi.string().max(300).required(),
  body: Joi.string().allow('', null),
  excerpt: Joi.string().max(500).allow('', null),
  author: Joi.string().max(200).allow('', null),
  metadata: Joi.object().default({}),
  is_published: Joi.boolean().default(true),
  is_featured: Joi.boolean().default(false),
});

const experienceSchema = Joi.object({
  greetings: Joi.array().items(Joi.object({
    id: Joi.string().uuid().optional(),
    text: Joi.string().required(),
    time_of_day: Joi.string().valid('morning','afternoon','evening','night','any'),
    weather_condition: Joi.string().allow(null),
    season: Joi.string().valid('spring','summer','autumn','winter','any'),
    mood_id: Joi.string().uuid().allow(null),
    language: Joi.string(),
    is_active: Joi.boolean()
  })),
  quotes: Joi.array().items(Joi.object({
    id: Joi.string().uuid().optional(),
    page_type: Joi.string(),
    type: Joi.string().valid('quote','affirmation','seasonal','announcement'),
    body: Joi.string().required(),
    author: Joi.string().allow(''),
    priority: Joi.number().integer(),
    is_active: Joi.boolean()
  })),
  homeConfig: Joi.object({
    hero_subtitle: Joi.string().allow(''),
    footer_text: Joi.string().allow(''),
    footer_icon: Joi.string().allow('')
  }),
  recommendationRules: Joi.array().items(Joi.object({
    id: Joi.string().uuid().optional(),
    name: Joi.string().required(),
    description: Joi.string().allow(''),
    mood_id: Joi.string().uuid().allow(null),
    content_type_id: Joi.string().uuid().allow(null),
    time_of_day: Joi.string(),
    weather_condition: Joi.string().allow(''),
    season: Joi.string(),
    priority: Joi.number().integer(),
    is_active: Joi.boolean()
  })),
  dailyMessages: Joi.array().items(Joi.object({
    id: Joi.string().uuid().optional(),
    text: Joi.string().required(),
    subtext: Joi.string().allow(''),
    author: Joi.string().allow(''),
    source: Joi.string().allow(''),
    scheduled_date: Joi.date().allow(null),
    is_active: Joi.boolean()
  }))
});

const settingsSchema = Joi.object({
  language: Joi.string().max(10),
  theme_preference: Joi.string().max(50),
  notification_enabled: Joi.boolean(),
  auto_play_audio: Joi.boolean(),
  privacy_level: Joi.string().valid('private','shared','public')
});

function validateContent(data, isUpdate = false) {
  const schema = isUpdate ? contentSchema.fork(Object.keys(contentSchema.describe().keys), (key) => key.optional()) : contentSchema;
  return schema.validate(data);
}

function validateExperience(data) {
  return experienceSchema.validate(data);
}

function validateSettings(data) {
  return settingsSchema.validate(data);
}

module.exports = { validateContent, validateExperience, validateSettings };