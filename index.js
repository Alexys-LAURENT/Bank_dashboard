if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const optionBd = {
    host: '',
    user: '',
    password: '',
    port: 3306,
    database: 'bank_dashboard'
};

const express = require('express');
const mysql = require('mysql');
const Myconnection = require('express-myconnection');
const app = express();
const flash = require('express-flash');
const session = require('express-session');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const passport = require('passport');
const initializePassport = require('./passport-config');
const methodeOverride = require('method-override');
const { query } = require('express');
const connection = require('express-myconnection');


initializePassport(
    passport,
    email => users.find(user => user.email === email),
    IdU => users.find(user => user.IdU === IdU)
);


app.use(bodyParser.urlencoded({ extended: false }));
app.use(flash());
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(Myconnection(mysql, optionBd, 'pool'));
app.set("view engine", "ejs");
app.set("views", "public/views");
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: false }));
app.use(methodeOverride('_method'));

let users = []


app.get('/', checkNotAuthenticated, function (req, res) {
    res.redirect('/login');
})



app.get("/index2", checkAuthenticated, (req, res) => {
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
        } else {
            console.log('Connexion réussie');
            sql = "select * from compte where IdU = ?"
            connection.query(sql, [req.user.IdU], (erreur, resultat) => {
                if (erreur) {
                    console.log(erreur);
                } else {
                    let compte = resultat;
                    sql = "select * from transactions where IdC = ? and DateT<=curdate() order by DateT DESC LIMIT 5"
                    connection.query(sql, [compte[0].IdC], (erreur, resultat) => {
                        if (erreur) {
                            console.log(erreur);
                        } else {
                            let transactions = resultat;
                            sql = "Select IdC from compte where IdU = ?";
                            connection.query(sql, [req.user.IdU], (erreur, resultat) => {
                                if (erreur) {
                                    throw erreur;
                                } else {
                                    idcompte = resultat[0].IdC;
                                    sql = "select ROUND(sum(Montant),2) as totdepense from transactions where substr(DateT,6,2) = Month(curDate()) and IdC = ? and TypeOf like 'Depense'";
                                    connection.query(sql, [idcompte], (erreur, resultat) => {
                                        if (erreur) {
                                            throw erreur;
                                        } else {
                                            let totdepense = '';
                                            if (!resultat.length) {
                                                totdepense = 0;
                                            } else {
                                                totdepense = resultat[0].totdepense;
                                            }
                                            sql = "select ROUND(sum(Montant),2) as totrentree from transactions where substr(DateT,6,2) = Month(curDate()) and IdC = ? and TypeOf like 'Rentree'"
                                            connection.query(sql, [idcompte], (erreur, resultat) => {
                                                if (erreur) {
                                                    throw erreur;
                                                } else {
                                                    let totrentree = '';
                                                    if (!resultat.length) {
                                                        totrentree = 0;
                                                    } else {
                                                        totrentree = resultat[0].totrentree;
                                                    }
                                                    sql = "select ROUND(sum(Montant),2) as totreccurence from transactions where substr(DateT,6,2) = Month(curDate()) and IdC = ? and Categorie like 'reccurence'";
                                                    connection.query(sql, [idcompte], (erreur, resultat) => {
                                                        if (erreur) {
                                                            throw erreur;
                                                        } else {
                                                            let totreccurence = '';
                                                            if (!resultat.length) {
                                                                totreccurence = 0;
                                                            } else {
                                                                totreccurence = resultat[0].totreccurence;
                                                            }
                                                            sql = "select * from transactions where DateT > curdate() and IdC = ?";
                                                            connection.query(sql, [req.user.IdU], (erreur, resultat) => {
                                                                if (erreur) {
                                                                    throw erreur;
                                                                } else {
                                                                    let alltransacsup = resultat;
                                                                    sql = "SELECT categorie,COUNT(IdT) as Somme from transactions where Month(DateT) = Month(curdate()) and DateT <= curdate() and IdC = ? AND TypeOf like 'Depense' GROUP BY Categorie;";
                                                                    connection.query(sql, [compte[0].IdC], (erreur, resultat) => {
                                                                        if (erreur) {
                                                                            throw erreur;
                                                                        } else {
                                                                            let camembert = resultat;
                                                                            sql = "select *,DATE_FORMAT(DateT,'%D %b %Y') AS DateTT from transactions where IdC = ? and Month(DateT) = Month(curdate()) and DateT <= curdate() and TypeOf not like 'Init' order by DateT Desc limit 30;";
                                                                            connection.query(sql, [compte[0].IdC], (erreur, resultat) => {
                                                                                if (erreur) {
                                                                                    throw erreur;
                                                                                } else {
                                                                                    let transactions30 = 0;
                                                                                    if (!resultat.length) {
                                                                                        transactions30 = 0;
                                                                                    } else {
                                                                                        transactions30 = resultat;
                                                                                    }
                                                                                    res.status(200).render("index2", {
                                                                                        transactions: transactions,
                                                                                        compte: compte,
                                                                                        name: req.user.name, lastname: req.user.lastname,
                                                                                        id: req.user.IdU,
                                                                                        totdepense: totdepense,
                                                                                        totrentree: totrentree,
                                                                                        totreccurence: totreccurence,
                                                                                        alltransacsup: alltransacsup,
                                                                                        camembert: camembert,
                                                                                        transactions30: transactions30
                                                                                    });
                                                                                }
                                                                            })
                                                                        }
                                                                    })
                                                                }
                                                            })
                                                        }
                                                    })
                                                }
                                            })
                                        }
                                    })
                                }
                            })
                        }
                    })
                }
            });
        }
    });
});

app.get('/transactions-a-venir', checkAuthenticated, (req, res) => {
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
        } else {
            sql = "select *,DATE_FORMAT(DateT,'%D %b %Y') AS DateTT,DATE_FORMAT(DateT,'%Y/%m/%d') AS preset from transactions where IdC = ? and TypeOf not like 'Init' and DateT > curdate() order by DateT ASC;"
            connection.query(sql, [req.user.IdU], (erreur, resultat) => {
                if (erreur) {
                    throw erreur;
                } else {
                    let transactionsavenir = 0;
                    if (!resultat.length) {
                        transactionsavenir = 0;
                    } else {
                        transactionsavenir = resultat;
                    }
                    res.status(200).render("transactions-a-venir", {
                        transactionsavenir: transactionsavenir
                    });
                }
            })
        }
    })
})

app.get('/all-transactions', checkAuthenticated, (req, res) => {
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
        } else {
            sql = "select *,DATE_FORMAT(DateT,'%D %b %Y') AS DateTT,DATE_FORMAT(DateT,'%Y/%m/%d') AS preset from transactions where IdC = ? and TypeOf not like 'Init' and DateT <= curdate() order by DateT DESC;"
            connection.query(sql, [req.user.IdU], (erreur, resultat) => {
                if (erreur) {
                    throw erreur;
                } else {
                    let alltransactions = 0;
                    if (!resultat.length) {
                        alltransactions = 0;
                    } else {
                        alltransactions = resultat;
                    }
                    res.status(200).render("all-transactions", {
                        alltransactions: alltransactions
                    });
                }
            })
        }
    })
})


app.get('/modifytransactionavenir/:typeof/:idt/:montant/:nom/:categorie/:anneedatet/:moisdatet/:jourdatet', checkAuthenticated, (req, res) => {
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
        } else {
            sql = "select *,DATE_FORMAT(DateT,'%D %b %Y') AS DateTT from transactions where IdC = ? and TypeOf not like 'Init' and DateT > curdate() order by DateTT ASC;"
            connection.query(sql, [req.user.IdU], (erreur, resultat) => {
                if (erreur) {
                    throw erreur;
                } else {
                    let leTypeOf = req.params.typeof;
                    let leIdT = req.params.idt;
                    let leMontant = req.params.montant;
                    let leNom = req.params.nom;
                    let anneedatet = req.params.anneedatet;
                    let moisdatet = req.params.moisdatet;
                    let jourdatet = req.params.jourdatet;
                    let leCategorie = req.params.categorie;
                    let transactionsavenir = 0;
                    if (!resultat.length) {
                        transactionsavenir = 0;
                    } else {
                        transactionsavenir = resultat;
                    }
                    res.status(200).render("modify-transactionavenir", {
                        transactionsavenir: transactionsavenir,
                        leTypeOf: leTypeOf,
                        leIdT: leIdT,
                        leMontant: leMontant,
                        leNom: leNom,
                        anneedatet: anneedatet,
                        moisdatet: moisdatet,
                        jourdatet: jourdatet,
                        leCategorie: leCategorie
                    });
                }
            })
        }
    })
})


app.get('/modifytransaction/:typeof/:idt/:montant/:nom/:categorie/:anneedatet/:moisdatet/:jourdatet', checkAuthenticated, (req, res) => {
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
        } else {
            sql = "select *,DATE_FORMAT(DateT,'%D %b %Y') AS DateTT,DATE_FORMAT(DateT,'%Y/%m/%d') AS preset from transactions where IdC = ? and TypeOf not like 'Init' and DateT <= curdate() order by DateT DESC;"
            connection.query(sql, [req.user.IdU], (erreur, resultat) => {
                if (erreur) {
                    throw erreur;
                } else {
                    let leTypeOf = req.params.typeof;
                    let leIdT = req.params.idt;
                    let leMontant = req.params.montant;
                    let leNom = req.params.nom;
                    let anneedatet = req.params.anneedatet;
                    let moisdatet = req.params.moisdatet;
                    let jourdatet = req.params.jourdatet;
                    let leCategorie = req.params.categorie;
                    let alltransactions = 0;
                    if (!resultat.length) {
                        alltransactions = 0;
                    } else {
                        alltransactions = resultat;
                    }
                    res.status(200).render("modify-transaction", {
                        alltransactions: alltransactions,
                        leTypeOf: leTypeOf,
                        leIdT: leIdT,
                        leMontant: leMontant,
                        leNom: leNom,
                        anneedatet: anneedatet,
                        moisdatet: moisdatet,
                        jourdatet: jourdatet,
                        leCategorie: leCategorie
                    });
                }
            })
        }
    })
})

app.post('/modifytransactionavenir', checkAuthenticated, (req, res) => {
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
        } else {
            let lemontant = 0;
            let lenom = '';
            let total = 0;
            let ancientotal = 0;
            let nouveautotal = 0;
            let sql = "select Montant,Nom from transactions where IdT = ?";
            connection.query(sql, [req.body.IdT], (erreur, resultat) => {
                if (erreur) {
                    throw erreur;
                } else {
                    lemontant = resultat[0].Montant;
                    lenom = resultat[0].Nom;
                    if (req.body.Categorie == "Reccurence") {
                        sql = "select * from transactions where IdC = ? and Categorie = 'Reccurence' and Nom = ? ;";
                        connection.query(sql, [req.user.IdU, lenom], (erreur, resultat) => {
                            if (erreur) {
                                throw erreur;
                            } else {
                                total = resultat.length;
                                sql = "update transactions set Nom = ?, Categorie = ?, Montant = ?, TypeOf = ? where Nom = ? and Categorie = 'Reccurence' and IdC = ? ;";
                                connection.query(sql, [req.body.Nom, req.body.Categorie, req.body.Montant, req.body.TypeOf, lenom, req.user.IdU], (erreur, resultat) => {
                                    if (erreur) {
                                        throw erreur;
                                    } else {
                                        ancientotal = lemontant * total;
                                        sql = "update compte set Solde = Solde + ? where IdC = ? ;";
                                        connection.query(sql, [ancientotal, req.user.IdU], (erreur, resultat) => {
                                            if (erreur) {
                                                throw erreur;
                                            } else {
                                                nouveautotal = req.body.Montant * total;
                                                sql = "update compte set Solde = Solde - ? where IdC = ? ;";
                                                connection.query(sql, [nouveautotal, req.user.IdU], (erreur, resultat) => {
                                                    if (erreur) {
                                                        throw erreur;
                                                    } else {
                                                        res.redirect('/transactions-a-venir');
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        sql = "update transactions set Nom = ?, Categorie = ?, Montant = ?, TypeOf = ?, DateT = ? where IdT = ?;";
                        connection.query(sql, [req.body.Nom, req.body.Categorie, req.body.Montant, req.body.TypeOf, req.body.DateT, req.body.IdT], (erreur, resultat) => {
                            if (erreur) {
                                throw erreur;
                            } else {
                                if (req.body.TypeOf == "Rentree") {
                                    sql = "update compte set Solde = Solde - ? where IdC = ? ;";
                                    connection.query(sql, [lemontant, req.user.IdU], (erreur, resultat) => {
                                        if (erreur) {
                                            throw erreur;
                                        } else {
                                            sql = "update compte set Solde = Solde + ? where IdC = ? ;",
                                                connection.query(sql, [req.body.Montant, req.user.IdU], (erreur, resultat) => {
                                                    if (erreur) {
                                                        throw erreur;
                                                    } else {
                                                        res.redirect('/transactions-a-venir');
                                                    }
                                                })
                                        }
                                    })
                                } else {
                                    sql = "update compte set Solde = Solde + ? where IdC = ? ;";
                                    connection.query(sql, [lemontant, req.user.IdU], (erreur, resultat) => {
                                        if (erreur) {
                                            throw erreur;
                                        } else {
                                            sql = "update compte set Solde = Solde - ? where IdC = ? ;",
                                                connection.query(sql, [req.body.Montant, req.user.IdU], (erreur, resultat) => {
                                                    if (erreur) {
                                                        throw erreur;
                                                    } else {
                                                        res.redirect('/transactions-a-venir');
                                                    }
                                                })
                                        }
                                    })
                                }
                            }
                        })
                    }
                }
            })
        }
    })
})



app.post('/modifytransaction', checkAuthenticated, (req, res) => {
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
        } else {
            let lemontant = 0;
            let lenom = '';
            let total = 0;
            let ancientotal = 0;
            let nouveautotal = 0;
            let sql = "select Montant,Nom from transactions where IdT = ?";
            connection.query(sql, [req.body.IdT], (erreur, resultat) => {
                if (erreur) {
                    throw erreur;
                } else {
                    lemontant = resultat[0].Montant;
                    lenom = resultat[0].Nom;
                    if (req.body.Categorie == "Reccurence") {
                        sql = "select * from transactions where IdC = ? and Categorie = 'Reccurence' and Nom = ? ;";
                        connection.query(sql, [req.user.IdU, lenom], (erreur, resultat) => {
                            if (erreur) {
                                throw erreur;
                            } else {
                                total = resultat.length;
                                sql = "update transactions set Nom = ?, Categorie = ?, Montant = ?, TypeOf = ? where Nom = ? and Categorie = 'Reccurence' and IdC = ? ;";
                                connection.query(sql, [req.body.Nom, req.body.Categorie, req.body.Montant, req.body.TypeOf, lenom, req.user.IdU], (erreur, resultat) => {
                                    if (erreur) {
                                        throw erreur;
                                    } else {
                                        ancientotal = lemontant * total;
                                        sql = "update compte set Solde = Solde + ? where IdC = ? ;";
                                        connection.query(sql, [ancientotal, req.user.IdU], (erreur, resultat) => {
                                            if (erreur) {
                                                throw erreur;
                                            } else {
                                                nouveautotal = req.body.Montant * total;
                                                sql = "update compte set Solde = Solde - ? where IdC = ? ;";
                                                connection.query(sql, [nouveautotal, req.user.IdU], (erreur, resultat) => {
                                                    if (erreur) {
                                                        throw erreur;
                                                    } else {
                                                        res.redirect('/all-transactions');
                                                    }
                                                })
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    } else {
                        sql = "update transactions set Nom = ?, Categorie = ?, Montant = ?, TypeOf = ?, DateT = ? where IdT = ?;";
                        connection.query(sql, [req.body.Nom, req.body.Categorie, req.body.Montant, req.body.TypeOf, req.body.DateT, req.body.IdT], (erreur, resultat) => {
                            if (erreur) {
                                throw erreur;
                            } else {
                                if (req.body.TypeOf == "Rentree") {
                                    sql = "update compte set Solde = Solde - ? where IdC = ? ;";
                                    connection.query(sql, [lemontant, req.user.IdU], (erreur, resultat) => {
                                        if (erreur) {
                                            throw erreur;
                                        } else {
                                            sql = "update compte set Solde = Solde + ? where IdC = ? ;",
                                                connection.query(sql, [req.body.Montant, req.user.IdU], (erreur, resultat) => {
                                                    if (erreur) {
                                                        throw erreur;
                                                    } else {
                                                        res.redirect('/all-transactions');
                                                    }
                                                })
                                        }
                                    })
                                } else {
                                    sql = "update compte set Solde = Solde + ? where IdC = ? ;";
                                    connection.query(sql, [lemontant, req.user.IdU], (erreur, resultat) => {
                                        if (erreur) {
                                            throw erreur;
                                        } else {
                                            sql = "update compte set Solde = Solde - ? where IdC = ? ;",
                                                connection.query(sql, [req.body.Montant, req.user.IdU], (erreur, resultat) => {
                                                    if (erreur) {
                                                        throw erreur;
                                                    } else {
                                                        res.redirect('/all-transactions');
                                                    }
                                                })
                                        }
                                    })
                                }
                            }
                        })
                    }

                }
            })
        }
    })
})



app.get("/login", checkNotAuthenticated, (req, res) => {
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
        } else {
            console.log('Connexion réussie');
            connection.query('Select * from users;', [], (erreur, resultat) => {
                if (erreur) {
                    console.log(erreur);
                } else {
                    users = resultat;
                    res.render("login");
                }
            });
        }
    });
});


app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/index2',
    failureRedirect: '/login',
    failureFlash: true
}));


app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render("register");
});

app.post('/register', checkNotAuthenticated, async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.getConnection((erreur, connection) => {
            if (erreur) {
                console.log(erreur);
            } else {
                console.log('Connexion réussie');
                sql = "Insert into users values(null,?,?,?,?);";
                connection.query(sql, [req.body.name, req.body.email, hashedPassword, req.body.lastname], (erreur, resultat) => {
                    if (erreur) {
                        console.log(erreur);
                    } else {
                        sql = "select IdU from users where email = ?";
                        connection.query(sql, [req.body.email], (erreur, resultat) => {
                            if (erreur) {
                                throw erreur;
                            } else {
                                let iduser = resultat[0].IdU;
                                sql = "insert into compte values (null,?,null,?,?);";
                                connection.query(sql, [req.body.solde, req.body.nomcompte, iduser], (erreur, resultat) => {
                                    if (erreur) {
                                        throw erreur;
                                    } else {
                                        console.log('création de compte réussi');
                                        sql = "select IdC from compte where IdU = ?;";
                                        connection.query(sql, [iduser], (erreur, resultat) => {
                                            if (erreur) {
                                                throw erreur;
                                            } else {
                                                let idcompte = resultat[0].IdC;
                                                sql = "insert into transactions values (null,'',0,?,'Init','','1990-01-01','initialisation');";
                                                for (let i = 1; i <= 5; i++) {
                                                    connection.query(sql, [idcompte], (erreur, resultat) => {
                                                        if (erreur) {
                                                            throw erreur;
                                                        } else {
                                                            console.log("transaction " + i + " réussie");
                                                        }
                                                    })
                                                }
                                                res.redirect('/login');
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                });
            }
        });
    } catch {
        res.redirect('/register');
    }
});


app.post('/addrevenu', (req, res) => {
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
        } else {
            sql = "insert into transactions values (null,?,?,?,'Rentree',null,?,?)";
            connection.query(sql, [req.body.categorie, req.body.montant, req.user.IdU, req.body.DateT, req.body.nom], (erreur, resultat) => {
                if (erreur) {
                    throw erreur;
                } else {
                    console.log('transactions ajoutée !');
                    sql = "update compte set Solde = Solde + ? where IdC = ?";
                    connection.query(sql, [req.body.montant, req.user.IdU], (erreur, resultat) => {
                        if (erreur) {
                            throw erreur;
                        } else {
                            console.log('solde mis à jour !');
                            res.redirect('/index2');
                        }
                    })
                }
            })
        }
    })
})



app.post('/adddepense', (req, res) => {
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
        } else {
            if (req.body.categorie == "Reccurence") {
                sql = "select * from transactions where IdC = ? and Categorie = 'Reccurence' and Nom like ?;";
                connection.query(sql, [req.user.IdU, req.body.nom], (erreur, resultat) => {
                    if (erreur) {
                        throw erreur
                    } else {
                        if (!resultat.length) {
                            console.log("existe pas");
                            let ladate = new Date(req.body.DateT);
                            for (var z = 1; z <= req.body.dureereccurence; z++) {
                                sql = "insert into transactions values (null,?,?,?,'Depense',null,?,?)";
                                connection.query(sql, [req.body.categorie, req.body.montant, req.user.IdU, ladate, req.body.nom], (erreur, resultat) => {
                                    if (erreur) {
                                        throw erreur;
                                    } else {
                                        console.log('transactions ajoutée !');
                                        sql = "update compte set Solde = Solde - ? where IdC = ?";
                                        connection.query(sql, [req.body.montant, req.user.IdU], (erreur, resultat) => {
                                            if (erreur) {
                                                throw erreur;
                                            } else {
                                                console.log('solde mis à jour !');
                                            }
                                        })
                                    }
                                })
                                ladate.setMonth(ladate.getMonth() + 1);
                            }
                            res.redirect('/index2');
                        } else {
                            console.log("existe déjà");
                            req.flash('info', 'Il existe déjà une réccurence a ce nom !');
                            res.redirect('/index2');
                        }
                    }
                })
            } else {
                sql = "insert into transactions values (null,?,?,?,'Depense',null,?,?)";
                connection.query(sql, [req.body.categorie, req.body.montant, req.user.IdU, req.body.DateT, req.body.nom], (erreur, resultat) => {
                    if (erreur) {
                        throw erreur;
                    } else {
                        console.log('transactions ajoutée !');
                        sql = "update compte set Solde = Solde - ? where IdC = ?";
                        connection.query(sql, [req.body.montant, req.user.IdU], (erreur, resultat) => {
                            if (erreur) {
                                throw erreur;
                            } else {
                                console.log('solde mis à jour !');
                                res.redirect('/index2');
                            }
                        })
                    }
                })
            }
        }
    })
})


app.get("/removetransaction/:TypeOf/:id/:montant/:Nom/:Categorie", checkAuthenticated, (req, res) => {
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
        } else {
            sql = "select * from transactions where IdT = ?";
            connection.query(sql, [req.params.id], (erreur, resultat) => {
                if (erreur) {
                    throw erreur;
                } else {
                    if (req.user.IdU == resultat[0].IdC) {
                        sql = "select * from transactions where IdT = ?;";
                        connection.query(sql, [req.params.id], (erreur, resultat) => {
                            if (erreur) {
                                throw erreur
                            } else {
                                if (resultat[0].Montant == req.params.montant) {
                                    if (req.params.Categorie == "Reccurence") {
                                        sql = "select * from transactions where IdC = ? and Categorie = 'Reccurence' and Nom = ? ;";
                                        connection.query(sql, [req.user.IdU, req.params.Nom], (erreur, resultat) => {
                                            if (erreur) {
                                                throw erreur;
                                            } else {
                                                let total = req.params.montant * resultat.length;
                                                console.log(total);
                                                let sql = "delete from transactions where IdC = ? and Categorie = 'Reccurence' and Nom = ? ;";
                                                connection.query(sql, [req.user.IdU, req.params.Nom], (erreur, resultat) => {
                                                    if (erreur) {
                                                        throw erreur;
                                                    } else {
                                                        let sql = "update compte set solde = solde + ? where IdC = ?";
                                                        connection.query(sql, [total, req.user.IdU], (erreur, resultat) => {
                                                            if (erreur) {
                                                                throw erreur;
                                                            } else {
                                                                res.redirect('/all-transactions');
                                                            }
                                                        });
                                                    }
                                                })
                                            }
                                        })
                                    } else {
                                        let sql = "delete from transactions where IdT = ?;";
                                        connection.query(sql, [req.params.id], (erreur, resultat) => {
                                            if (erreur) {
                                                throw erreur;
                                            } else {
                                                if (req.params.TypeOf == "Depense") {
                                                    let sql = "update compte set solde = solde + ? where IdC = ?";
                                                    connection.query(sql, [req.params.montant, req.user.IdU], (erreur, resultat) => {
                                                        if (erreur) {
                                                            throw erreur;
                                                        } else {
                                                            res.redirect('/all-transactions');
                                                        }
                                                    });
                                                } else {
                                                    let sql = "update compte set solde = solde - ? where IdC = ?";
                                                    connection.query(sql, [req.params.montant, req.user.IdU], (erreur, resultat) => {
                                                        if (erreur) {
                                                            throw erreur;
                                                        } else {
                                                            res.redirect('/all-transactions');
                                                        }
                                                    });
                                                }
                                            }
                                        })
                                    }
                                } else {
                                    res.redirect('/all-transactions');
                                }
                            }
                        })
                    } else {
                        res.redirect('/all-transactions');
                    }
                }
            })
        }
    })
})


app.get("/removetransactionavenir/:TypeOf/:id/:montant/:Nom/:Categorie", checkAuthenticated, (req, res) => {
    req.getConnection((erreur, connection) => {
        if (erreur) {
            console.log(erreur);
        } else {
            sql = "select * from transactions where IdT = ?";
            connection.query(sql, [req.params.id], (erreur, resultat) => {
                if (erreur) {
                    throw erreur;
                } else {
                    if (req.user.IdU == resultat[0].IdC) {
                        sql = "select * from transactions where IdT = ?;";
                        connection.query(sql, [req.params.id], (erreur, resultat) => {
                            if (erreur) {
                                throw erreur
                            } else {
                                if (resultat[0].Montant == req.params.montant) {
                                    if (req.params.Categorie == "Reccurence") {
                                        sql = "select * from transactions where IdC = ? and Categorie = 'Reccurence' and Nom = ? and DateT > curdate();";
                                        connection.query(sql, [req.user.IdU, req.params.Nom], (erreur, resultat) => {
                                            if (erreur) {
                                                throw erreur;
                                            } else {
                                                let total = req.params.montant * resultat.length;
                                                console.log(total);
                                                let sql = "delete from transactions where IdC = ? and Categorie = 'Reccurence' and Nom = ? and DateT > curdate() ;";
                                                connection.query(sql, [req.user.IdU, req.params.Nom], (erreur, resultat) => {
                                                    if (erreur) {
                                                        throw erreur;
                                                    } else {
                                                        let sql = "update compte set solde = solde + ? where IdC = ?";
                                                        connection.query(sql, [total, req.user.IdU], (erreur, resultat) => {
                                                            if (erreur) {
                                                                throw erreur;
                                                            } else {
                                                                res.redirect('/transactions-a-venir');
                                                            }
                                                        });
                                                    }
                                                })
                                            }
                                        })
                                    } else {
                                        let sql = "delete from transactions where IdT = ?;";
                                        connection.query(sql, [req.params.id], (erreur, resultat) => {
                                            if (erreur) {
                                                throw erreur;
                                            } else {
                                                if (req.params.TypeOf == "Depense") {
                                                    let sql = "update compte set solde = solde + ? where IdC = ?";
                                                    connection.query(sql, [req.params.montant, req.user.IdU], (erreur, resultat) => {
                                                        if (erreur) {
                                                            throw erreur;
                                                        } else {
                                                            res.redirect('/transactions-a-venir');
                                                        }
                                                    });
                                                } else {
                                                    let sql = "update compte set solde = solde - ? where IdC = ?";
                                                    connection.query(sql, [req.params.montant, req.user.IdU], (erreur, resultat) => {
                                                        if (erreur) {
                                                            throw erreur;
                                                        } else {
                                                            res.redirect('/transactions-a-venir');
                                                        }
                                                    });
                                                }
                                            }
                                        })
                                    }
                                } else {
                                    res.redirect('/transactions-a-venir');
                                }
                            }
                        })
                    } else {
                        res.redirect('/transactions-a-venir');
                    }
                }
            })
        }
    })
})





app.delete('/logout', (req, res) => {
    req.logout(function (err) {
        if (err) { return err; }
        res.redirect('/login');
    });
});



function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next()
    }

    res.redirect('/login')
}



function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/index2')
    }
    next()
}




app.get('*', function (req, res) {
    res.status(200).render("404");
})
app.listen(3001);
