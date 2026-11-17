const Hero = require ("../models/Hero");
const Movie = require("../models/Movie");

//mostrar todos os herois
async function list(req, res) {
    try {
        const heroes = await Hero.findAll({
            include: Movie
        });

        return res.status(200).json(heroes);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao listar heróis.",
            error: error.message
        });
    }
}


//buscar heroi pelo ID
async function getById(req, res) {
    try {
        const hero = await Hero.findByPk(req.params.id, {
            include: Movie
        });

        if (!hero) {
            return res.status(404).json({
                message: "Herói não encontrado."
            });
        }

        return res.status(200).json(hero);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao buscar herói.",
            error: error.message
        });
    }
}


//cadastrar heroi
async function create(req,res){
    try {
        const { name, universe, power } = req.body;  //descerialização

        if (!name || !universe || !power){
            return res.status(400).json({
                message: "Nome, universo e poder são obrigatórios"
            });
        }

        const hero = await Hero.create({
            name, 
            universe, 
            power});

        return res.status(201).json(hero); 

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao cadastrar herói.",
            error: error.message
        });
    }
}


//substituir tudo do heroi
async function replace(req, res) {
    try {
        const hero = await Hero.findByPk(req.params.id);
        if (!hero) {
            return res.status(404).json({ message: "Herói não encontrado." });
        }

        const { name, universe, power } = req.body;
        if (!name || !universe || !power) {
            return res.status(400).json({
                message: "Para PUT, informe nome, universo e poder."
            });
        }

        hero.name = name;
        hero.universe = universe;
        hero.power = power;
        await hero.save();

        return res.status(200).json(hero);
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao substituir herói.",
            error: error.message
        });
    }
}

//muda apenas alguns dadods do heroi
async function update(req, res) {
    try {
        const hero = await Hero.findByPk(req.params.id);
        if (!hero) {
            return res.status(404).json({ message: "Herói não encontrado." });
        }

        const { name, universe, power } = req.body;
        if (name === undefined && universe === undefined && power === undefined) {
            return res.status(400).json({
                message: "Informe pelo menos um campo para atualizar."
            });
        }

        if (name !== undefined) hero.name = name;
        if (universe !== undefined) hero.universe = universe;
        if (power !== undefined) hero.power = power;

        await hero.save();
        return res.status(200).json(hero);
    } catch (error) {
        return res.status(500).json({
            message: "Erro ao atualizar herói.",
            error: error.message
        });
    }
}


//deletar heroi
async function remove(req, res) {
    try {
        const hero = await Hero.findByPk(req.params.id);

        if (!hero) {
            return res.status(404).json({
                message: "Herói não encontrado."
            });
        }

        await hero.destroy();

        return res.status(200).json({
            message: "Herói excluído com sucesso."
        });

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao excluir herói.",
            error: error.message
        });
    }
}


//mostrar os filmes de tal heroi
async function listMovies(req, res) {
    try {
        const hero = await Hero.findByPk(req.params.id);

        if (!hero) {
            return res.status(404).json({
                message: "Herói não encontrado."
            });
        }

        const movies = await hero.getMovies();

        return res.status(200).json(movies);

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao listar filmes.",
            error: error.message
        });
    }
}


//associar filme a um herói
async function addMovie(req, res) {
    try {
        const hero = await Hero.findByPk(req.params.id);
        const movie = await Movie.findByPk(req.params.movieId);

        if (!hero || !movie) {
            return res.status(404).json({
                message: "Herói ou filme não encontrado."
            });
        }

        await hero.addMovie(movie);

        return res.status(200).json({
            message: "Filme associado ao herói com sucesso."
        });

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao associar filme.",
            error: error.message
        });
    }
}


//remover associação entre heroi e filme
async function removeMovie(req, res) {
    try {
        const hero = await Hero.findByPk(req.params.id);
        const movie = await Movie.findByPk(req.params.movieId);

        if (!hero || !movie) {
            return res.status(404).json({
                message: "Herói ou filme não encontrado."
            });
        }

        await hero.removeMovie(movie);

        return res.status(200).json({
            message: "Associação removida com sucesso."
        });

    } catch (error) {
        return res.status(500).json({
            message: "Erro ao remover associação.",
            error: error.message
        });
    }
}


//pesquisar assinc await
module.exports = {
    list,
    getById,
    create,
    replace,
    update,
    remove,
    listMovies,
    addMovie,
    removeMovie
};