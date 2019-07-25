module.exports = function (app) {
    var User = app.models.Member;
    var Role = app.models.Role;
    var RoleMapping = app.models.RoleMapping;
    return new Promise(function (resolve, reject) {
            User.create([
                {
                    name: 'Hanifa Beg'
                    , empid: '123456'
                    , username: 'hanifabeg'
                    , email: 'hanifa.beg@gmail.com'
                    , password: '123456'
        },

  ], function (err, users) {
                if (err) reject(err);
                resolve(users)
            })
        }).then(function (users) {
            console.log('Created users:', users);
            return new Promise(function (resolve, reject) {
                //create the superadmin role
                Role.create({
                    name: 'SuperAdmin'
                }, function (err, role) {
                    if (err) reject(err);
                    resolve({
                        "role": role
                        , "users": users
                    })
                })
            })
        }).then(function (data) {
            console.log("data in role", data)
            console.log('Created users:', data.users);
            console.log('Created role:', data.role);
            return new Promise(function (resolve, reject) {
                data.role.principals.create({
                    principalType: RoleMapping.USER
                    , principalId: data.users[0].id
                }, function (err, principal) {
                    if (err) throw err;
                    else {
                        resolve(data)
                    }
                })
            })
        }).then(function (data) {
            console.log('Created principal:', data);
            return new Promise(function (resolve, reject) {
                //create the superadmin role
                Role.create({
                    name: 'Admin'
                }, function (err, role) {
                    if (err) throw err;
                    else {
                        resolve(data)
                    }
                })
            })
        }).then(function (data) {
            console.log('Created role:', data);
            var whereFilter = {}
            whereFilter = {
                'where': {
                    'empid': data.empid
                }
            }
            return new Promise(function (resolve, reject) {
                User.upsertWithWhere(whereFilter, {
                    "empid": data.empid
                    , "role": 'SuperAdmin'
                }, function (err, result) {
                    if (err) reject(err)
                    else {
                        console.log("result", result)
                        resolve(result)
                    }
                })
            })
        }).then(function (data) {
            console.log('Created:', data);
        }).catch(function (err) {
            console.log("err", err)
        })
        /* User.create([
        {
            name: 'John'
            , empid: '1234567'
            , username: 'John'
            , email: 'john@doe.com'
            , password: 'opensesame'
        },

  ], function (err, users) {
        if (err) throw err;
        console.log('Created users:', users);
        //create the superadmin role
        Role.create({
            name: 'SuperAdmin'
        }, function (err, role) {
            if (err) throw err;
            console.log('Created role:', role);
            //make bob an admin
            role.principals.create({
                principalType: RoleMapping.USER
                , principalId: users[0].id
            }, function (err, principal) {
                if (err) throw err;
                console.log('Created principal:', principal);
            });
        });
    });*/
};
//module.exports = function (app) {
//    var Role = app.models.Role;
//    var Member = app.models.Member;
//    Role.belongsTo(Member, {
//        foreignKey: 'name'
//    }, {
//        properties: function (inst) {
//            console.log("inst", inst)
//        }
//    })
//}