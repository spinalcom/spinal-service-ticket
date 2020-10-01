/*
 * Copyright 2019 SpinalCom - www.spinalcom.com
 *
 *  This file is part of SpinalCore.
 *
 *  Please read all of the following terms and conditions
 *  of the Free Software license Agreement ("Agreement")
 *  carefully.
 *
 *  This Agreement is a legally binding contract between
 *  the Licensee (as defined below) and SpinalCom that
 *  sets forth the terms and conditions that govern your
 *  use of the Program. By installing and/or using the
 *  Program, you agree to abide by all the terms and
 *  conditions stated or referenced herein.
 *
 *  If you do not agree to abide by these terms and
 *  conditions, do not demonstrate your acceptance and do
 *  not install or use the Program.
 *  You should have received a copy of the license along
 *  with this file. If not, see
 *  <http://resources.spinalcom.com/licenses.pdf>.
 */

// import { ServiceTicket } from './ServiceTicket';
import { ServiceTicketPersonalized } from './ServiceTicketPersonalized';


const serviceTicketPersonalized = new ServiceTicketPersonalized();

const gRoot: any = typeof window === 'undefined' ? global : window;

if (typeof gRoot.spinal === 'undefined') gRoot.spinal = {};

if (typeof gRoot.spinal.SpinalServiceTicket === 'undefined') {
  gRoot.spinal.spinalServiceTicket = serviceTicketPersonalized;
  gRoot.spinal.serviceTicketPersonalized = serviceTicketPersonalized;
}


// tslint:disable-next-line:variable-name
const spinalServiceTicket = ServiceTicketPersonalized;

export { serviceTicketPersonalized, spinalServiceTicket };
