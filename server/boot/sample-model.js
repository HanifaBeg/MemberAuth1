module.exports = function (app) {
    var User = app.models.Member;
    var Role = app.models.MemberRole;
    var RoleMapping = app.models.RoleMemberMapping;
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
            RoleMapping.create({
                principalType: RoleMapping.USER
                , MemberId: data.users[0].id
                , RoleId: data.role.id
            }, function (err, principal) {
                if (err) reject(err);
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
                if (err) reject(err);
                else {
                    resolve(data)
                }
            })
        })
    }).then(function (data) {
        console.log('Created:', data);
    }).catch(function (err) {
        console.log("err", err)
    })
}