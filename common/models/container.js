module.exports = function(Container) {

  Container.afterRemote('create', function (context, instance, next) {
    next();
  });

  Container.beforeRemote('upload', function (ctx, instance, next) {
    // Insert the requesting user's ID as a header
    ctx.req.headers.userId = ctx.req.accessToken.userId;
    next();
  });

  Container.afterRemote('upload', function (ctx, instance, next) {
    console.log('afterRemote');
    // Retrieve the container and filename from the instance
    var container = instance.result.files.file[0].container;
    var filename = instance.result.files.file[0].name;
    console.log("haven't crashed");
    console.log("container:");
    console.log(container);
    console.log("filename");
    console.log(filename);
    console.log("instance");
    console.log(instance);
    // FIXME: This probably doesn't need to be inside a call to
    // Container.getFile
    Container.getFile(container, filename, function (err, res) {
      var Image = Container.app.models.Image;
      var DivesiteImage = Container.app.models.DivesiteImage;
      // FIXME: This is unlikely to be consistent across storage providers
      var url = "/api/Containers/" + container + "/download/" + filename;
      // Create an associated Image or DivesiteImage object
      if (ctx.req.headers.divesite) {
        // If there's a Divesite ID in a header, make this a DivesiteImage
        DivesiteImage.create({
          url: url,
          userId: ctx.req.headers.userId,
          divesiteId: ctx.req.headers.divesite
        }, next);
      } else {
        // If there's no Divesite ID in a header, then make this a
        // user (profile?) image
        Image.create({
          url: url,
          userId: ctx.req.headers.userId
        }, next);
      }
    });
  });
};
