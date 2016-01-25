import Ember from 'ember';

export default Ember.Route.extend({
  session: Ember.inject.service(),

  model(params) {
    let projectParams = this.paramsFor('project');
    let queryParams = {
      sluggedRouteSlug: projectParams.sluggedRouteSlug,
      projectSlug: projectParams.projectSlug,
      number: params.number
    };

    let userId = this.get('session.session.authenticated.user_id');

    return Ember.RSVP.hash({
      post: this.store.queryRecord('post', queryParams),
      user: Ember.isPresent(userId) ? this.store.find('user', userId) : null
    }).then((result) => {
      return Ember.RSVP.hash({
        post: result.post,
        comment: this.store.createRecord('comment', { post: result.post, user: result.user })
      });
    });
  },

  setupController(controller, models) {
    controller.set('post', models.post);
    controller.set('comment', models.comment);
  },

  actions: {
    saveComment(comment) {
      comment.save().catch((error) => {
        if (error.errors.length === 1) {
          this.set('error', error);
        }
      });
    }
  }
});
