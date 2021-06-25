const express = require('express');
const validate = require('../../validations/handler');
const controller = require('../../controllers/meeting.controller');
const rules = require('../../validations/meeting.validation');

const router = express.Router();

router
  .route('/')
  /**
   * @api {post} v1/users Create Meeting
   * @apiDescription Create a new meeting
   * @apiVersion 1.0.0
   * @apiName CreateMeeting
   * @apiGroup Meeting
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}              title         Meeting's title
   * @apiParam  {String}              description   Meeting's description
   * @apiParam  {Date}                startDate     Meeting's startDate
   * @apiParam  {Date}                endDate       Meeting's endDate
   * @apiParam  {String}              link          Meeting's link
   * @apiParam  {Integer}             tenantId      Meeting's tenantId
   *
   * @apiSuccess  {Integer}             id            Meeting's id
   * @apiSuccess  {String}              title         Meeting's title
   * @apiSuccess  {String}              description   Meeting's description
   * @apiSuccess  {String}              link          Meeting's link
   * @apiSuccess  {Date}                startDate     Meeting's startDate
   * @apiSuccess  {Date}                endDate       Meeting's endDate
   * @apiSuccess  {String}              link          Meeting's link
   * @apiSuccess  {Integer}             tenantId      Meeting's tenantId
   * @apiSuccess  {Integer}             creatorId     Meeting's creatorId
   * @apiSuccess  {Date}                createdAt     Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   */
  .post(validate(rules.createMeeting), controller.create);

router
  .route('/:meetingId')
  /**
   * @api {post} v1/users Join Meeting
   * @apiDescription Create a new meeting
   * @apiVersion 1.0.0
   * @apiName JoinMeeting
   * @apiGroup Meeting
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {String}              title         Meeting's title
   * @apiParam  {String}              description   Meeting's description
   * @apiParam  {Date}                startDate     Meeting's startDate
   * @apiParam  {Date}                endDate       Meeting's endDate
   * @apiParam  {String}              link          Meeting's link
   * @apiParam  {Integer}             tenantId      Meeting's tenantId
   *
   * @apiSuccess  {Integer}             id            Meeting's id
   * @apiSuccess  {String}              title         Meeting's title
   * @apiSuccess  {String}              description   Meeting's description
   * @apiSuccess  {String}              link          Meeting's link
   * @apiSuccess  {Date}                startDate     Meeting's startDate
   * @apiSuccess  {Date}                endDate       Meeting's endDate
   * @apiSuccess  {String}              link          Meeting's link
   * @apiSuccess  {Integer}             tenantId      Meeting's tenantId
   * @apiSuccess  {Integer}             creatorId     Meeting's creatorId
   * @apiSuccess  {Date}                createdAt     Timestamp
   *
   * @apiError (Bad Request 400)   ValidationError  Some parameters may contain invalid values
   * @apiError (Unauthorized 401)  Unauthorized     Only authenticated users can create the data
   */
  .post(controller.join);

router
  .route('/:tenantId')
  /**
   * @api {get} v1/meeting/:tenantId List Meetings
   * @apiDescription Get a list of meetings
   * @apiVersion 1.0.0
   * @apiName ListMeetings
   * @apiGroup Meeting
   * @apiPermission user
   *
   * @apiHeader {String} Authorization  User's access token
   *
   * @apiParam  {Integer}             tenantId      Meetings' tenantId
   *
   * @apiSuccess List of Meetings.
   *
   * @apiError (Unauthorized 401)  Unauthorized  Only authenticated users that joined this tenant or superadmins can access the data
   */
  .get(validate(rules.listMeetings), controller.list);
router
  .route('/:tenantId/:meetingId')
  /**
   * @api {patch} v1/meeting/:tenantId.:meetingId Get Meeting
   * @apiDescription Get Meeting information
   * @apiVersion 1.0.0
   * @apiName GetMeeting
   * @apiGroup Meeting
   * @apiPermission user
   *
   * @apiHeader {String} Authorization meeting's access token
   *
   * @apiSuccess  {Integer}             id            Meeting's id
   * @apiSuccess  {String}              title         Meeting's title
   * @apiSuccess  {String}              description   Meeting's description
   * @apiSuccess  {Date}                startDate     Meeting's startDate
   * @apiSuccess  {Date}                endDate       Meeting's endDate
   * @apiSuccess  {String}              link          Meeting's link
   * @apiSuccess  {Integer}             tenantId      Meeting's tenantId
   * @apiSuccess  {Integer}             creatorId     Meeting's creatorId
   * @apiSuccess  {Date}                createdAt     Timestamp
   *
   * @apiError (Unauthorized 401) Unauthorized Only authenticated users can access the data
   * @apiError (Forbidden 403)    Forbidden    Only user authenticated to meeting's tenant or superadmins can access the data
   * @apiError (Not Found 404)    NotFound     Meeting does not exist
   */
  .get(validate(rules.getMeeting), controller.get);
router
  .route('/:meetingId')
  /**
   * @api {patch} v1/meeting/:meetingId Update Meeting
   * @apiDescription Update some fields of a meeting document
   * @apiVersion 1.0.0
   * @apiName UpdateMeeting
   * @apiGroup Meeting
   * @apiPermission user
   *
   * @apiHeader {String} Authorization User's access token
   *
   * @apiParam  {String}              title         Meeting's title
   * @apiParam  {String}              description   Meeting's description
   * @apiParam  {Date}                startDate     Meeting's startDate
   * @apiParam  {Date}                endDate       Meeting's endDate
   *
   * @apiSuccess  {Integer}             id            Meeting's id
   * @apiSuccess  {String}              title         Meeting's title
   * @apiSuccess  {String}              description   Meeting's description
   * @apiSuccess  {Date}                startDate     Meeting's startDate
   * @apiSuccess  {Date}                endDate       Meeting's endDate
   * @apiSuccess  {String}              link          Meeting's link
   * @apiSuccess  {Integer}             tenantId      Meeting's tenantId
   * @apiSuccess  {Integer}             creatorId     Meeting's creatorId
   * @apiSuccess  {Date}                createdAt     Timestamp
   *
   * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values
   * @apiError (Forbidden 403)    Forbidden    Only  meeting creator or tenant admins can modify the data
   * @apiError (Not Found 404)    NotFound     Meeting does not exist
   */
  .patch(validate(rules.updateMeeting), controller.update)
  /**
   * @api {delete} v1/meeting/:meetingId Delete Meeting
   * @apiDescription Delete a meeting
   * @apiVersion 1.0.0
   * @apiName DeleteMeeting
   * @apiGroup Meeting
   * @apiPermission admin
   *
   * @apiHeader {String} Authorization User's access token
   *
   * @apiSuccess (OK 200)  Successfully deleted
   *
   * @apiError (Forbidden 403)    Forbidden    Only  meeting creator or tenant admins can modify the data
   * @apiError (Not Found 404)    NotFound      Meeting does not exist
   */
  .delete(validate(rules.deleteMeeting), controller.delete);

/**
 * @api {get} v1/meeting jitsiToken
 * @apiDescription Generate Jitsi token
 * @apiVersion 1.0.0
 * @apiName jitsiToken
 * @apiGroup Meeting
 * @apiPermission user
 *
 * @apiParam  {Boolean}                moderator
 * @apiParam  {Boolean}                livestreaming
 * @apiParam  {Boolean                 outboundCall
 * @apiParam  {Boolean}                transcription
 * @apiParam  {Boolean}                recording
 * @apiParam  {String}                 group
 *
 * @apiSuccess (Success 200) {String}  jitsiToken         User's jitsiToken
 *
 * @apiError (Forbidden 403)    Forbidden    Only  authorized users can access
 * @apiError (Bad Request 400)  ValidationError  Some parameters may contain invalid values or missing
 * @apiError (Bad Request 404)  NotFound  Tenant or meeting is not exist
 */

router.route('/jitsi/:meetingId').post(controller.jitsiToken);

module.exports = router;
