'use strict';
module.exports = function (Member) {
    Member.disableRemoteMethod('upsertWithWhere', true);
    Member.disableRemoteMethod('update', true);
    Member.disableRemoteMethod('resetPassword', true);
    Member.disableRemoteMethod('reset', true);
    Member.disableRemoteMethod('replaceOrCreate', true);
    Member.disableRemoteMethod('findOne', true);
    Member.disableRemoteMethod('count', true);
    Member.disableRemoteMethod('confirm', true);
    Member.disableRemoteMethod('createChangeStream', true);
    Member.disableRemoteMethod('verify', true);
    Member.disableRemoteMethod('__count__roles', true);
    Member.disableRemoteMethod('accessTokens/count', true);
    Member.disableRemoteMethod('__count__accessTokens', false);
    Member.disableRemoteMethod('__create__accessTokens', false);
    Member.disableRemoteMethod('__delete__accessTokens', false);
    Member.disableRemoteMethod('__destroyById__accessTokens', false);
    Member.disableRemoteMethod('__findById__accessTokens', false);
    Member.disableRemoteMethod('__get__accessTokens', false);
    Member.disableRemoteMethod('__updateById__accessTokens', false);
    Member.disableRemoteMethod("updateAttributes", false);
    Member.disableRemoteMethod('upsert', true);
    Member.disableRemoteMethod('deleteById', true);
    Member.disableRemoteMethod("updateAll", true);
    Member.disableRemoteMethod('create', true);
    Member.disableRemoteMethod('__delete__Member', true);
    Member.makeAdmin = function (email, cb) {
        var RoleMappingo = Member.app.models.RoleMapping;
        var mainObject = {};
        Member.findOne({
            where: {
                email: email
            }
        }, function (err, data) {
            console.log("data MakeAdmin", data)
            mainObject.userid = data.id;
            Member.app.models.Role.findOne({
                where: {
                    name: "Admin"
                }
            }, function (err, data) {
                console.log("pppp", data)
                RoleMappingo.create({
                    principalType: RoleMappingo.ROLE
                    , principalId: mainObject.userid
                    , roleId: data.id
                }, function (err, principal) {
                    if (err) throw err;
                    else {
                        console.log("principal", principal)
                        return cb(null, {
                            "message": "Admin role sucessfully assinged to " + email + ""
                        });
                    }
                })
            })
        })
    }
    Member.login = function (credentials, include, cb) {
        var User = Member.app.models.User;
        var RoleMapping = Member.app.models.RoleMapping;
        var mainObject = {};
        // {include: 'posts'}
        var Role = Member.app.models.Role;
        User.login(credentials, 'user', function (err, token) {
            if (err) {
                console.log("errrrrrr", err)
                cb(null, {
                    title: 'Login failed'
                    , content: err
                });
                return;
            }
            console.log('token+++++++', token)
            mainObject.id = token.id;
            User.findOne({
                where: {
                    _id: token.userId
                }
            }, function (err, data) {
                mainObject.email = data.email
                mainObject.username = data.username
                mainObject.empid = data.empid
                mainObject.password = data.password
                Member.findOne({
                    where: {
                        email: mainObject.email
                    }
                }, function (err, data) {
                    if (err) console.log("err", err)
                    else {
                        console.log("data", data);
                        if (!data) {
                            Member.create([
                                {
                                    _id: {
                                        "$toObjectId": mainObject.id
                                    }
                                    , name: mainObject.username
                                    , empid: mainObject.empid
                                    , username: mainObject.username
                                    , email: mainObject.email
                                    , password: mainObject.password
                            },

                      ], function (err, user) {
                                if (err) console.log(err);
                                console.log(user)
                                if (!user[0].role) {
                                    role = "Non admin";
                                }
                                return cb(null, {
                                    username: user[0].username
                                    , id: user[0].id
                                    , email: user[0].email
                                    , accessToken: mainObject.id
                                });
                            })
                        }
                        else {
                            console.log(data)
                            var MainData = data
                            RoleMapping.findOne({
                                where: {
                                    principalId: data.id
                                }
                            }, function (err, data) {
                                console.log("RoleMapping", data)
                                Role.findOne({
                                    where: {
                                        _id: data.roleId
                                    }
                                }, function (err, data) {
                                    return cb(null, {
                                        username: MainData.username
                                        , role: data.name
                                        , email: MainData.email
                                        , accessToken: mainObject.id
                                    });
                                })
                            })
                        }
                    }
                })
            })
        });
    }
    Member.remoteMethod('makeAdmin', {
        accepts: {
            arg: 'email'
            , type: 'string'
        }
        , http: {
            path: '/makeAdmin'
            , verb: 'get'
        }
        , returns: {
            arg: 'status'
            , type: 'string'
        }
    });
};