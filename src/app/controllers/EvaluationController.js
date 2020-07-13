import * as Yup from 'yup';
import User from '../models/User';
import Evaluation from '../models/Evaluation';

class EvaluationController {
  async store(req, res) {
    const schema = Yup.object().shape({
      note: Yup.number().required(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const { provider_id } = req.params;
    const { note } = req.body;

    const provider = await User.findByPk(provider_id);

    if (!provider) {
      return res.status(401).json({ error: 'Prestador não encontrado' });
    }

    if (!provider.provider) {
      return res.status(401).json({ error: 'Este usuário não é um prestador' });
    }

    if (provider.id === req.userId) {
      return res.status(401).json({ error: 'Operação não autorizada' });
    }

    const checkEvaluation = await Evaluation.findOne({
      where: {
        user_id: req.userId,
        provider_id,
      },
    });

    if (checkEvaluation) {
      return res
        .status(401)
        .json({ error: 'Este prestador já foi avaliado por você' });
    }

    const data = {
      user_id: req.userId,
      provider_id,
      note,
    };

    const evaluation = await Evaluation.create(data);

    if (!evaluation.id) {
      return res.status(401).json({ error: 'Avaliação não foi registrada' });
    }

    const assessments = await Evaluation.findAll({
      where: {
        provider_id,
      },
    });

    const total = assessments.reduce(
      (acumulador, elemento) => acumulador + elemento.note,
      0
    );

    const media = total / assessments.length;

    await provider.update({
      evaluation: Number(media.toFixed(2)),
    });

    return res.json(evaluation);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      note: Yup.number().required(),
    });

    if (!schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const { provider_id } = req.params;
    const { note } = req.body;

    const provider = await User.findByPk(provider_id);

    if (!provider) {
      return res.status(401).json({ error: 'Prestador não encontrado' });
    }

    const evaluation = await Evaluation.findOne({
      where: {
        provider_id,
      },
    });

    if (!evaluation) {
      return res.status(401).json({ error: 'Você não avaliou este prestador' });
    }

    await evaluation.update({
      note,
    });

    const assessments = await Evaluation.findAll({
      where: {
        provider_id,
      },
    });

    const total = assessments.reduce(
      (acumulador, elemento) => acumulador + elemento.note,
      0
    );

    const media = total / assessments.length;

    await provider.update({
      evaluation: Number(media.toFixed(2)),
    });

    return res.json(evaluation);
  }
}

export default new EvaluationController();
