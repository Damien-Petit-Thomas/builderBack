const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
    .messages({
      'string.base': 'L\'adresse email doit valide',
      'string.empty': 'Le champ email est vide',
      'string.email': 'L\'adresse email doit être au format email',
      'any.required': 'L\'adresse email est requise',
    }),
  password: Joi.string()
    .required()
    .min(8)
    .max(30)
    .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,30}$/)
    .messages({
      'string.base': 'Le mot de passe doit être valide',
      'string.empty': 'Le mot de passe ne peut être vide',
      'any.required': 'Le mot de passe est requis',
      'string.pattern.base': 'Le mot de passe doit faire au moins 8 caractères, contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
    }),
  passwordConfirm: Joi.string()
    .valid(Joi.ref('password'))
    .required()
    .messages({
      'any.required': 'La confirmation du mot de passe est requise',
      'any.only': 'Les mots de passe ne correspondent pas',
    }),
});

module.exports = loginSchema;
