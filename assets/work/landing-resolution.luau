function LandingResolution.Resolve(context: MovementContext): MovementState
	if
		context.fallHeight
		and context.fallHeight >= context.constants.HardLandingHeightThreshold
	then
		return MovementStates.HardLanding
	end

	local hasInput = StateRules.HasMoveInput(context)
	if context.crouchHeld then
		return if hasInput then MovementStates.CrouchWalk else MovementStates.CrouchIdle
	elseif hasInput then
		local reallyForward = context.moveIntent.forward
			or (not context.cameraLocked and not context.moveIntent.backward)
		if reallyForward and context.preAirborneLocomotion then
			return context.preAirborneLocomotion :: MovementState
		end
		return MovementStates.Walk
	end
	return MovementStates.Idle
end

-- Fail at load time if any airborne state can't reach a landing target
for _, caller in ipairs(LANDING_CALLERS) do
	local edges = StateRules.Transitions[caller]
	for _, target in ipairs(RESOLVE_TARGETS) do
		assert(
			table.find(edges, target) ~= nil,
			`StateRules.Transitions[{tostring(caller)}] is missing landing target {tostring(target)}`
		)
	end
end
