module.exports = "syntax=\"proto3\";\n" +
"package grpcbus;\n" +
"\n" +
"// Wrapper for a message from client\n" +
"message GBClientMessage {\n" +
"  // Service management\n" +
"  GBCreateService service_create = 1;\n" +
"  GBReleaseService service_release = 2;\n" +
"\n" +
"  // Call management\n" +
"  GBCreateCall call_create = 3;\n" +
"  // Terminates a call\n" +
"  GBCallEnd    call_end    = 4;\n" +
"  GBSendCall   call_send   = 5;\n" +
"}\n" +
"\n" +
"message GBServerMessage {\n" +
"  // service management responses\n" +
"  GBCreateServiceResult service_create = 1;\n" +
"  GBReleaseServiceResult service_release = 2;\n" +
"\n" +
"  // Call management\n" +
"  GBCreateCallResult call_create = 3;\n" +
"  GBCallEvent         call_event = 4;\n" +
"  GBCallEnded         call_ended = 5;\n" +
"}\n" +
"\n" +
"// Information about a service\n" +
"message GBServiceInfo {\n" +
"  // Endpoint\n" +
"  string endpoint = 1;\n" +
"  // Fully qualified service identifier\n" +
"  string service_id = 2;\n" +
"  // TODO: figure out how to serialize credentials\n" +
"}\n" +
"\n" +
"// Initialize a new Service.\n" +
"message GBCreateService {\n" +
"  // ID of the service, client-generated, unique.\n" +
"  int32 service_id = 1;\n" +
"  GBServiceInfo service_info = 2;\n" +
"}\n" +
"\n" +
"// Release an existing / pending Service.\n" +
"message GBReleaseService {\n" +
"  int32 service_id = 1;\n" +
"}\n" +
"\n" +
"message GBCallInfo {\n" +
"  string method_id = 1;\n" +
"  bytes bin_argument = 2;\n" +
"}\n" +
"\n" +
"// Create a call\n" +
"message GBCreateCall {\n" +
"  int32 service_id = 1;\n" +
"  int32 call_id = 2;\n" +
"  // Info\n" +
"  GBCallInfo info = 3;\n" +
"}\n" +
"\n" +
"// When the call is ended\n" +
"message GBCallEnded {\n" +
"  int32 call_id = 1;\n" +
"  int32 service_id = 2;\n" +
"}\n" +
"\n" +
"// End the call\n" +
"message GBEndCall {\n" +
"  int32 call_id = 1;\n" +
"  int32 service_id = 2;\n" +
"}\n" +
"\n" +
"// Send a message on a streaming call\n" +
"message GBSendCall {\n" +
"  int32 call_id = 1;\n" +
"  int32 service_id = 2;\n" +
"  bytes bin_data = 3;\n" +
"  // Do we want to just send end() over a streaming call?\n" +
"  bool is_end = 4;\n" +
"}\n" +
"\n" +
"// Result of attempting to create a service\n" +
"message GBCreateServiceResult {\n" +
"  // ID of service, client-generated, unique\n" +
"  int32 service_id = 1;\n" +
"  // Result\n" +
"  ECreateServiceResult result = 2;\n" +
"  // Error details\n" +
"  string error_details = 3;\n" +
"\n" +
"  enum ECreateServiceResult {\n" +
"    // Success\n" +
"    SUCCESS = 0;\n" +
"    // Invalid service ID, retry with a new one.\n" +
"    INVALID_ID = 1;\n" +
"    // GRPC internal error constructing the service.\n" +
"    GRPC_ERROR = 2;\n" +
"  }\n" +
"}\n" +
"\n" +
"// When the server releases a service\n" +
"message GBReleaseServiceResult {\n" +
"  int32 service_id = 1;\n" +
"}\n" +
"\n" +
"// Result of creating a call.\n" +
"// This is sent immediately after starting call.\n" +
"message GBCreateCallResult {\n" +
"  int32 call_id = 1;\n" +
"  int32 service_id = 4;\n" +
"\n" +
"  // Result\n" +
"  ECreateCallResult result = 2;\n" +
"  string error_details = 3;\n" +
"\n" +
"  enum ECreateCallResult {\n" +
"    // Success\n" +
"    SUCCESS = 0;\n" +
"    // Invalid call ID, retry with a new one.\n" +
"    INVALID_ID = 1;\n" +
"    // GRPC internal error initializing the call\n" +
"    GRPC_ERROR = 2;\n" +
"  }\n" +
"}\n" +
"\n" +
"// Received message during streaming call.\n" +
"message GBCallEvent {\n" +
"  // Call ID\n" +
"  int32 call_id = 1;\n" +
"  // Service ID\n" +
"  int32 service_id = 4;\n" +
"  // Event ID\n" +
"  string event = 2;\n" +
"  // JSON data.\n" +
"  string json_data = 3;\n" +
"  // Binary data\n" +
"  bytes bin_data = 5;\n" +
"}\n" +
"\n" +
"// Terminate a call\n" +
"message GBCallEnd {\n" +
"  int32 call_id = 1;\n" +
"  int32 service_id = 2;\n" +
"}";
