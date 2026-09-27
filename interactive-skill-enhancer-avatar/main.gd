extends Node3D

enum AvatarState { IDLE, THINKING, TALKING, WALKING, VICTORY }

@export var backend_url: String = "http://127.0.0.1:8000"
@onready var animation_player: AnimationPlayer = $Doctor_Male_Young/AnimationPlayer

var http_request: HTTPRequest
var current_state: AvatarState = AvatarState.IDLE
var talk_timer: Timer

func _ready():
	# Setup HTTP Request node dynamically
	http_request = HTTPRequest.new()
	add_child(http_request)
	http_request.request_completed.connect(_on_http_request_completed)

	# Setup Talking state timer
	talk_timer = Timer.new()
	talk_timer.one_shot = true
	talk_timer.timeout.connect(_on_talk_timer_timeout)
	add_child(talk_timer)

	print("🎮 Godot Avatar Controller initialized.")
	print("Available animations:", get_available_animations())
	play_idle()

func get_available_animations() -> Array:
	if animation_player:
		return animation_player.get_animation_list()
	return []

func play_animation(anim_name: String) -> bool:
	if not animation_player:
		return false

	var list = animation_player.get_animation_list()
	var target = ""

	# Check exact match
	if animation_player.has_animation(anim_name):
		target = anim_name
	else:
		# Partial match fallback
		for a in list:
			if anim_name.to_lower() in a.to_lower():
				target = a
				break

	if target == "":
		if list.size() > 0:
			target = list[0]
		else:
			print("⚠️ No animations available.")
			return false

	var anim = animation_player.get_animation(target)
	if anim:
		anim.loop_mode = Animation.LOOP_LINEAR

	animation_player.play(target)
	return true

func play_idle():
	current_state = AvatarState.IDLE
	play_animation("Idle")

func play_thinking():
	current_state = AvatarState.THINKING
	play_animation("Idle") # Use subtle animation for thinking

func play_talking(duration: float = 4.0):
	current_state = AvatarState.TALKING
	play_animation("Walk") # Subtle movement while talking
	talk_timer.start(duration)

func play_walk():
	current_state = AvatarState.WALKING
	play_animation("Walk")

func play_victory():
	current_state = AvatarState.VICTORY
	play_animation("Idle")

func ask_backend(message: String):
	if current_state == AvatarState.THINKING:
		return

	play_thinking()
	var url = backend_url + "/chatbot/"
	var headers = ["Content-Type: application/json"]
	var body = JSON.stringify({"message": message, "history": []})

	var err = http_request.request(url, headers, HTTPClient.METHOD_POST, body)
	if err != OK:
		print("❌ HTTP Request failed to initialize: ", err)
		play_idle()

func _on_http_request_completed(result: int, response_code: int, headers: PackedStringArray, body: PackedByteArray):
	if result != HTTPRequest.RESULT_SUCCESS or response_code != 200:
		print("⚠️ Backend unavailable or HTTP error code: ", response_code)
		play_idle()
		return

	var json_str = body.get_string_from_utf8()
	var json = JSON.new()
	var parse_err = json.parse(json_str)

	if parse_err == OK and json.data is Dictionary:
		var reply = json.data.get("response", "")
		print("🤖 AI Response received by Godot: ", reply)
		var speak_duration = max(3.0, reply.length() * 0.05)
		play_talking(speak_duration)
	else:
		print("⚠️ Malformed response from backend")
		play_idle()

func _on_talk_timer_timeout():
	if current_state == AvatarState.TALKING:
		play_idle()
