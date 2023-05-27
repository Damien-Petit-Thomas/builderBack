const Joi = require('joi');

const userschema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30)
    .required()
    .messages({
      'string.base': 'Le nom du dresseur de Pokémon doit ếtre en toutes lettres',
      'string.empty': 'Il faut un nom de dresseur de Pokémon',
      'string.min': 'Le nom de dresseur doit contenir au moins 3 caractères',
      'string.max': 'Le nom du dresseur ne doit pas dépasser 30 caractères',
      'any.required': 'Le nom du dresseur est requis',
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
      'string.complexity': 'Le mot de passe doit faire au moins 8 caractères, contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial',
    }),
  passwordConfirm: Joi.ref('password'),
  email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required()
    .messages({
      'string.base': 'L\'adresse email doit être une chaîne de caractères',
      'string.empty': 'L\'adresse email ne doit pas être vide',
      'string.email': 'L\'adresse email doit être au format email',
      'any.required': 'L\'adresse email est requise',
    }),
});

module.exports = userschema;
