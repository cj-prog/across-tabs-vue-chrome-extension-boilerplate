<template>
  <div class="info">
    <title>Child Tab</title>
    <div v-if="tabInfo">
        I am a <strong>CHILD TAB</strong>, opened by my Master: <strong>
        {{tabInfo.parentName}}
        </strong>.<br/>
        My id is: <strong>
        {{tabInfo.id}}
        </strong>.<br/>
        My name is: <strong>
        {{tabInfo.name}}
        </strong>
        <br/><br/>
        <button class="btn btn--success" v-on:click="sendToParent()">Send message
       to Parent</button>
        <button class="btn btn--danger margin--half-left"
                v-on:click="closeTab()">Close me</button>
        <br/><br/>Events:<br/><br/>
    </div>
    <p v-html="html"></p>

  </div>
</template>

<script>
  import AcrossTabs from 'across-tabs'

  export default {
  data: function() {
return {
    tabInfo: {},
    html: '',
    i: 0,
  child: new AcrossTabs.Child({
    onReady: this.onReady,
    onInitialize: this.onInitialize,
    handshakeExpiryLimit: 4000, // msec
    onParentDisconnect: this.onParentDisconnect,
    onParentCommunication: this.onParentCommunication
  }),
  };
},

  // Anything within the ready function will run when the application loads
  ready: function() {},

  // Methods we want to use in our application are registered here
  methods: {
    // eslint-disable-next-line no-unused-vars
    onParentDisconnect() {
      var data = '<li>Uhh no! Parent disconnected :(</li>';
      this.showList(data);
      // window.close();
    },
    sendToParent() {
      const msg = "Yo! Message from child!"
      var tabInfo = this.child.getTabInfo();
      var data = {
        msg: msg,
        id: tabInfo.id
      };
      this.child.sendMessageToParent(data);
    },
    closeTab: function() {
      window.close();
    },
    onInitialize() {
      this.tabInfo = this.child.getTabInfo();
    },
    onReady() {
      var data = '<li>Loaded</li>';
      this.showList(data);
    },
    onParentCommunication(dataReceived) {
      var data = '<li>Message recieved from parent - ' + dataReceived + '</li>';
      this.showList(data);
    },
    showList(data) {
      this.html += data;
      // document.getElementById('info').innerHTML = this.html;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
