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

"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const Constants_1 = require("./Constants");
const Errors_1 = require("./Errors");
class ServiceTicket {
    constructor() {
    }
    init() {
        this.context = spinal_env_viewer_graph_service_1.SpinalGraphService.getContext(Constants_1.SERVICE_NAME);
        if (typeof this.context !== 'undefined') {
            this.initVar(this.context.info.id.get())
                .catch((e) => {
                throw new Error(e);
            });
        }
        else {
            this.createContext()
                .catch((e) => {
                throw new Error(e);
            });
        }
    }
    addDefaultSentence(processId, sentence) {
        if (!this.processes.has(processId)) {
          return Promise.reject( '${PROCESS_ID_DOES_NOT_EXIST}: ${processId}' );
        }
      return spinal_env_viewer_graph_service_1.SpinalGraphService
        .getChildren( processId, [Constants_1.SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_SECTION_RELATION_NAME] )
        .then( ( children ) => {
          if (children.length > 0) {
            const sectionId = children[0].id.get();
            const sentenceId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode( {
              name: sentence,
              type: Constants_1.SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_TYPE,
            } );
            return spinal_env_viewer_graph_service_1.SpinalGraphService
              .addChildInContext( sectionId, sentenceId, this.contextId, Constants_1.SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_RELATION_TYPE )
              .then( () => {
                return Promise.resolve( true );
              } );
          }
          return this.addSentenceSection( processId ).then( ( bool ) => {
            if (bool) {
              return this.addDefaultSentence( processId, sentence );
            }
          } );
        });
    }
    addStep(stepId, processId) {
        if (!this.processes.has(processId)) {
            return Promise.reject(Error(Errors_1.PROCESS_ID_DOES_NOT_EXIST));
        }
        if (!this.steps.has(stepId)) {
            return Promise.reject(Error(Errors_1.STEP_ID_DOES_NOT_EXIST));
        }
        return spinal_env_viewer_graph_service_1.SpinalGraphService
            .addChildInContext(processId, stepId, this.contextId, Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_TYPE)
            .then(() => {
            this.addStepToProcess(stepId, processId);
            return Promise.resolve(true);
        })
            .catch((e) => {
            return Promise.reject(Error(Errors_1.CANNOT_ADD_STEP_TO_PROCESS + e));
        });
    }
  
  addTicketToProcess( ticketId, processId ) {
    const process = spinal_env_viewer_graph_service_1.SpinalGraphService.getNode( processId );
    return this.addTicket( ticketId, process.defaultStepId.get() );
  }
    addTicket(ticketId, stepId) {
        if (!this.steps.has(stepId)) {
            return Promise.reject(Error(Errors_1.STEP_ID_DOES_NOT_EXIST));
        }
        if (!this.tickets.has(ticketId)) {
            return Promise.reject(Error(Errors_1.TICKET_ID_DOES_NOT_EXIST));
        }
        return spinal_env_viewer_graph_service_1.SpinalGraphService
            .addChildInContext(stepId, ticketId, this.contextId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE)
            .then(() => {
            this.addTicketToStep(ticketId, stepId);
              return this.addTicketToProcessTicketSection( stepId, ticketId ).then( () => {
                return Promise.resolve( true );
              } );
        })
            .catch((e) => {
            return Promise.reject(Error(Errors_1.CANNOT_ADD_STEP_TO_PROCESS + e));
        });
    }
  
  createProcess( process ) {
    if (this.processNames.has( process.name )) {
            return Promise.reject(Error(Errors_1.PROCESS_NAME_ALREADY_USED));
        }
    process.type = Constants_1.PROCESS_TYPE;
    const processId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode( process );
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addChildInContext(this.contextId, processId, this.contextId, Constants_1.SPINAL_TICKET_SERVICE_PROCESS_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_PROCESS_RELATION_TYPE).then(() => {
            this.processNames.add(name);
            this.processes.add(processId);
            return this.initProcess( processId ).then( () => {
              return Promise.resolve( processId );
            } );
        })
            .catch((e) => {
            console.error(e);
            return Promise.reject(Error(Errors_1.CANNOT_CREATE_PROCESS_INTERNAL_ERROR));
        });
    }
    createStep(name, color) {
      const stepId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode( {
        name,
        color,
        type: Constants_1.SPINAL_TICKET_SERVICE_STEP_TYPE,
      } );
        this.steps.add(stepId);
        return stepId;
    }
    createTicket(info) {
      const ticketId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode( {
        name: info.name,
        type: Constants_1.SPINAL_TICKET_SERVICE_TICKET_TYPE,
      }, info );
        this.tickets.add(ticketId);
        return ticketId;
    }
    createArchives() {
        const archives = spinal_env_viewer_graph_service_1.SpinalGraphService
            .getChildren(this.contextId, [Constants_1.SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME]);
        if (archives.leght > 0) {
            return;
        }
        const archiveId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
            name: Constants_1.SPINAL_TICKET_SERVICE_ARCHIVE_NAME,
            type: Constants_1.SERVICE_ARCHIVE_TYPE,
        });
        return spinal_env_viewer_graph_service_1.SpinalGraphService
            .addChild(this.contextId, archiveId, Constants_1.SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_ARCHIVE_RELATION_TYPE)
            .then((res) => {
            return Promise.resolve(true);
        })
            .catch((e) => {
            return Promise.reject(Error(e));
        });
    }
    getContext() {
        if (typeof this.contextId !== 'undefined') {
            return Promise.resolve(this.contextId);
        }
        return this.createContext()
            .then(() => {
            return Promise.resolve(this.contextId);
        });
    }
    getAllProcess() {
        return this.processes;
    }
    getAllTickets() {
        return this.tickets;
    }
    getStepsFromProcess(processId) {
        return this.stepByProcess.get(processId);
    }
    getTicketsFromStep(stepId) {
        return this.ticketByStep.get(stepId);
    }
  
  getDefaultSentenceFromProcess( processId ) {
    return spinal_env_viewer_graph_service_1.SpinalGraphService
      .getChildren( processId, [Constants_1.SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_SECTION_RELATION_NAME] )
      .then( ( children ) => {
        if (children.length > 0) {
          return spinal_env_viewer_graph_service_1.SpinalGraphService
            .getChildren( children[0].id.get(), [Constants_1.SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_RELATION_NAME] );
        }
        return Promise.resolve( [] );
      } );
  }
  
  moveTicket( ticketId, stepFromId, stepToId ) {
    spinal_env_viewer_graph_service_1.SpinalGraphService.modifyNode( ticketId, { stepId: stepToId } );
    spinal_env_viewer_graph_service_1.SpinalGraphService
      .moveChild( stepFromId, stepToId, ticketId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_RELATION_TYPE );
  }
    initVar(contextId) {
      this.contextId = contextId;
        this.processes = new Set();
        this.processNames = new Set();
        this.steps = new Set();
        this.tickets = new Set();
        this.stepByProcess = new Map();
        this.ticketByStep = new Map();
      this.processByStep = new Map();
      return spinal_env_viewer_graph_service_1.SpinalGraphService.getChildrenInContext( this.contextId, contextId )
            .then((children) => {
            for (let i = 0; i < children.length; i = i + 1) {
                const child = children[i];
              this.processNames.add( child.name.get() );
              this.processes.add( child.id.get() );
            }
            this.initialized = true;
              return this.retrieveStep();
        })
            .catch((e) => {
        });
    }
  
  retrieveStep() {
    const promises = [];
    for (const processId of this.processes) {
      promises.push( spinal_env_viewer_graph_service_1.SpinalGraphService
        .getChildren( processId, [Constants_1.SPINAL_TICKET_SERVICE_STEP_RELATION_NAME] ) );
    }
    return Promise.all( promises )
      .then( ( res ) => {
        for (const children of res) {
          for (const child of children) {
            this.steps.add( child.id.get() );
            this.addStepToProcess( child.id.get(), child.processId.get() );
            this.processByStep.set( child.id.get(), child.processId.get() );
          }
        }
      } );
  }
    addStepToProcess(stepId, processId) {
        let steps = [];
        if (!this.steps.has(stepId) || !this.processes.has(processId)) {
            return false;
        }
        this.processByStep.set(stepId, processId);
      spinal_env_viewer_graph_service_1.SpinalGraphService.modifyNode( stepId, { processId } );
        if (this.stepByProcess.has(processId)) {
            steps = this.stepByProcess.get(processId);
            if (steps.indexOf(stepId) !== -1) {
                return false;
            }
            steps.push(stepId);
            this.stepByProcess.set(processId, steps);
            return true;
        }
        this.stepByProcess.set(processId, [stepId]);
        return true;
    }
    addTicketToStep(ticketId, stepId) {
        let tickets = [];
        if (!this.tickets.has(ticketId) || !this.steps.has(stepId)) {
            return false;
        }
      spinal_env_viewer_graph_service_1.SpinalGraphService.modifyNode( ticketId, { stepId } );
        if (this.ticketByStep.has(stepId)) {
            tickets = this.ticketByStep.get(stepId);
            if (tickets.indexOf(stepId) !== -1) {
                return false;
            }
            tickets.push(stepId);
            this.ticketByStep.set(stepId, tickets);
            return true;
        }
        this.ticketByStep.set(stepId, [ticketId]);
        return true;
    }
  
  addTicketToProcessTicketSection( stepId, ticketId ) {
    const processId = this.processByStep.get( stepId );
    spinal_env_viewer_graph_service_1.SpinalGraphService.modifyNode( ticketId, {
      stepId,
      processId
    } );
    return spinal_env_viewer_graph_service_1.SpinalGraphService
      .getChildren( processId, [Constants_1.SPINAL_TICKET_SERVICE_TICKET_SECTION_RELATION_NAME] )
      .then( ( children ) => {
        return spinal_env_viewer_graph_service_1.SpinalGraphService
          .addChild( children[0].id.get(), ticketId, Constants_1.PROCESS_HAS_TICKET_RELATION_NAME, Constants_1.PROCESS_HAS_TICKET_RELATION_TYPE );
      } );
  }
    createContext() {
        return spinal_env_viewer_graph_service_1.SpinalGraphService.addContext(Constants_1.SERVICE_NAME, Constants_1.SERVICE_TYPE, undefined)
            .then((context) => {
            this.context = context;
            this.contextId = context.info.id.get();
              return this.initVar( context.info.id.get() )
                .then( () => {
                  return Promise.resolve( context );
                } );
        })
            .catch((e) => {
            console.error(e);
            return Promise.reject(Error(Errors_1.CANNOT_CREATE_CONTEXT_INTERNAL_ERROR));
        });
    }
    addSentenceSection(processId) {
        if (!this.processes.has(processId)) {
            throw new Error(Errors_1.PROCESS_ID_DOES_NOT_EXIST);
        }
        return spinal_env_viewer_graph_service_1.SpinalGraphService
            .getChildren(processId, [Constants_1.SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_SECTION_RELATION_NAME])
            .then((children) => {
            if (children.length > 0) {
              return Promise.reject( Errors_1.DEFAULT_SENTENCE_SECTION_ALREADY_EXIST );
            }
            const sentenceId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode({
              name: 'Default Sentences.',
              type: Constants_1.SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_SECTION_TYPE,
            });
            return spinal_env_viewer_graph_service_1.SpinalGraphService
                .addChildInContext(processId, sentenceId, this.contextId, Constants_1.SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_SECTION_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_DEFAULT_SENTENCE_SECTION_RELATION_TYPE)
              .then( ( e ) => {
                return Promise.resolve( true );
              } )
              .catch( ( e ) => {
                return Promise.reject( e );
              } );
            } );
    }
  
  addTicketSection( processId ) {
    if (!this.processes.has( processId )) {
      throw new Error( Errors_1.PROCESS_ID_DOES_NOT_EXIST );
    }
    return spinal_env_viewer_graph_service_1.SpinalGraphService
      .getChildren( processId, [Constants_1.SPINAL_TICKET_SERVICE_TICKET_SECTION_RELATION_NAME] )
      .then( ( children ) => {
        if (children.length > 0) {
          return Promise.reject( Errors_1.TICKET_SECTION_ALREADY_EXIST );
        }
        const ticketsId = spinal_env_viewer_graph_service_1.SpinalGraphService.createNode( {
          name: 'Tickets',
          type: Constants_1.SPINAL_TICKET_SERVICE_TICKET_SECTION,
        } );
        return spinal_env_viewer_graph_service_1.SpinalGraphService
          .addChildInContext( processId, ticketsId, this.contextId, Constants_1.SPINAL_TICKET_SERVICE_TICKET_SECTION_RELATION_NAME, Constants_1.SPINAL_TICKET_SERVICE_TICKET_SECTION_RELATION_TYPE )
          .then( ( e ) => {
                return Promise.resolve(true);
            })
                .catch((e) => {
                return Promise.reject(e);
            });
        });
    }
  
  initProcess( processId ) {
    const steps = this.createDefaultSteps();
    const promises = [];
    spinal_env_viewer_graph_service_1.SpinalGraphService.modifyNode( processId, { defaultStepId: steps[0] } );
    promises.push( this.addTicketSection( processId ) );
    for (const stepId of steps) {
      promises.push( this.addStep( stepId, processId ) );
    }
    return Promise.all( promises );
  }
  
  createDefaultSteps() {
    const steps = [];
    for (let i = 0; i < Constants_1.DEFAULT_STEPS.length; i = i + 1) {
      const step = Constants_1.DEFAULT_STEPS[i];
      steps.push( this.createStep( step.name, step.color ) );
    }
    return steps;
  }
}
exports.ServiceTicket = ServiceTicket;
//# sourceMappingURL=ServiceTicket.js.map