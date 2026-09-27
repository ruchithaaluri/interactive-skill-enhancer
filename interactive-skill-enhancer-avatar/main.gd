extends Node3D

enum AvatarState {
	IDLE,
	LISTENING,
	THINKING,
	SPEAKING,
	ENCOURAGING,
	CORRECT,
	INCORRECT_SUPPORT,
	QUIZ_COMPLETE
}

@export var backend_url: String = "http://127.0.0.1:8000"
@export var use_female_doctor: bool = true

var active_model: Node3D = null
var animation_player: AnimationPlayer = null

var http_request: HTTPRequest
var current_state: AvatarState = AvatarState.IDLE
var speech_timer: Timer

func _ready():
	# Resolve active 3D model node (Female Doctor preferred, Male Doctor fallback)
	if use_female_doctor and has_node("Doctor_Female_Young"):
		active_model = $Doctor_Female_Young
		if has_node("Doctor_Male_Young"):
			$Doctor_Male_Young.visible = false
		$Doctor_Female_Young.visible = true
		print("👩‍⚕️ Dr. Mentor Active Model: Doctor_Female_Young")
	elif has_node("Doctor_Male_Young"):
		active_model = $Doctor_Male_Young
		if has_node("Doctor_Female_Young"):
			$Doctor_Female_Young.visible = false
		$Doctor_Male_Young.visible = true
		print("👨‍⚕️ Dr. Mentor Active Model: Doctor_Male_Young")

	if active_model and active_model.has_node("AnimationPlayer"):
		animation_player = active_model.get_node("AnimationPlayer") as AnimationPlayer

	# Setup HTTP Request node dynamically
	http_request = HTTPRequest.new()
	add_child(http_request)
	http_request.request_completed.connect(_on_http_request_completed)

	# Setup Speech/State Timer
	speech_timer = Timer.new()
	speech_timer.one_shot = true
	speech_timer.timeout.connect(_on_speech_timer_timeout)
	add_child(speech_timer)

	print("🎮 Godot AI Doctor Controller initialized.")
	print("Available animations:", get_available_animations())
	set_state(AvatarState.IDLE)

func get_available_animations() -> Array:
	if animation_player:
		return animation_player.get_animation_list()
	return []

func play_animation(anim_name: String) -> bool:
	if not animation_player:
		return false

	var list = animation_player.get_animation_list()
	var target = ""

	if animation_player.has_animation(anim_name):
		target = anim_name
	else:
		for a in list:
			if anim_name.to_lower() in a.to_lower():
				target = a
				break

	if target == "":
		if list.size() > 0:
			target = list[0]
		else:
			print("⚠️ No animation tracks available.")
			return false

	var anim = animation_player.get_animation(target)
	if anim:
		anim.loop_mode = Animation.LOOP_LINEAR

	animation_player.play(target)
	return true

func set_state(new_state: AvatarState, duration: float = 0.0):
	current_state = new_state

	match current_state:
		AvatarState.IDLE:
			play_animation("Idle")
		AvatarState.LISTENING:
			play_animation("Idle")
		AvatarState.THINKING:
			play_animation("Idle")
		AvatarState.SPEAKING:
			play_animation("Walk") # Subtle, natural body movement while speaking
		AvatarState.ENCOURAGING:
			play_animation("Idle")
		AvatarState.CORRECT:
			play_animation("Walk") # Enthusiastic posture
		AvatarState.INCORRECT_SUPPORT:
			play_animation("Idle") # Calm, supportive posture
		AvatarState.QUIZ_COMPLETE:
			play_animation("Walk")

	if duration > 0.0:
		speech_timer.start(duration)

func play_idle():
	set_state(AvatarState.IDLE)

func play_listening():
	set_state(AvatarState.LISTENING)

func play_thinking():
	set_state(AvatarState.THINKING)

func play_speaking(duration: float = 4.0):
	set_state(AvatarState.SPEAKING, duration)

func play_encouraging(duration: float = 3.0):
	set_state(AvatarState.ENCOURAGING, duration)

func play_correct(duration: float = 3.0):
	set_state(AvatarState.CORRECT, duration)

func play_incorrect_support(duration: float = 3.0):
	set_state(AvatarState.INCORRECT_SUPPORT, duration)

func play_quiz_complete(duration: float = 4.0):
	set_state(AvatarState.QUIZ_COMPLETE, duration)

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
		print("🤖 AI Response received by Godot Doctor: ", reply)
		var speak_duration = max(3.0, reply.length() * 0.05)
		play_speaking(speak_duration)
	else:
		print("⚠️ Malformed response from backend")
		play_idle()

func _on_speech_timer_timeout():
	set_state(AvatarState.IDLE)
