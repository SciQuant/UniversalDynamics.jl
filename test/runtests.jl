using UniversalDynamics
using Test

using DiffEqNoiseProcess
using LinearAlgebra

@testset "Out of Place" begin include("oop.jl") end
@testset "Short Rate Model" begin include("short_rate_model.jl") end
@testset "Libor Market Model" begin include("libor_market_model.jl") end
@testset "Heath Jarrow Morton Model" begin include("heath_jarrow_morton_model.jl") end


# see https://discourse.julialang.org/t/hi-suppose-i-want-to-code-a-function-that-returns-a-svector-but-each-component/54372
# using BenchmarkTools
# using StaticArrays
# using UnPack

# N = 10
# τ = @SVector [0.25 for i in 1:N]
# Tenors = vcat(zero(eltype(τ)), cumsum(τ))
# σ(t) = @SVector ones(10)
# ρ = @SMatrix rand(N,N)
# u = @SVector ones(N)
# p = (τ = τ, Tenors = Tenors, σ = σ, ρ = ρ)
# t = 0.1
# val = Val{N}()

# @inline function driftlmm1(u, p, t, ::Val{D}) where {D}
#     @unpack Tenors, τ, ρ = p
#     σ = p.σ(t)

#     du = @MVector zeros(eltype(u), D)

#     @inbounds begin
#         # 'i' ranges from 2 to D-1 because L₁ and LD have μ = 0
#         for i in 2:D-1
#             if t ≤ Tenors[i]
#                 for j in i+1:D
#                     du[i] += (ρ[i,j] * τ[j] * σ[j] * u[j]) / (1 + τ[j] * u[j])
#                 end
#                 du[i] *= (-σ[i] * u[i])
#             end
#         end
#     end

#     return convert(SVector, du)
# end

# @btime driftlmm1($u, $p, $t, $val)

# @inline function driftlmm2(u, p, t, ::Val{D}) where {D}
#     @unpack Tenors, τ, ρ = p
#     σ = p.σ(t)

#     @inbounds begin
#         return SVector(ntuple(Val{D}()) do i
#             du = zero(eltype(u))
#             if t ≤ Tenors[i]
#                 for j in i+1:D
#                     du += (ρ[i,j] * τ[j] * σ[j] * u[j]) / (1 + τ[j] * u[j])
#                 end
#                 du *= (-σ[i] * u[i])
#             end
#             du
#         end)
#     end
# end

# @btime driftlmm2($u, $p, $t, $val)