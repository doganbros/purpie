const express = require('express');
const statusMonitor = require('express-status-monitor')();
const tenantRoutes = require('./tenant.route');
const meetingRoutes = require('./meeting.route');
const roleRoutes = require('./role.route');
const userRoutes = require('./user.route');
const authRoutes = require('./auth.route');
const authenticate = require('../../middlewares/authenticate');

const router = express.Router();

/**
 * GET v1/status
 */
router.use(statusMonitor);

/**
 * GET v1/docs
 */

router.use('/tenant', authenticate(), tenantRoutes);
router.use('/meeting', authenticate(), meetingRoutes);
router.use('/role', authenticate(), roleRoutes);
router.use('/user', authenticate(), userRoutes);
router.use('/auth', authRoutes);

module.exports = router;
